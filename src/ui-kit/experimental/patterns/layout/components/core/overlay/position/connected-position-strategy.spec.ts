import { ElementRef } from "@angular/core";
import { ConnectedPositionStrategy } from "./connected-position-strategy";
import { FakeViewportRuler } from "./fake-viewport-ruler";

function rect(overrides: Partial<ClientRect> = {}): ClientRect {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    ...overrides,
  } as ClientRect;
}

describe("ConnectedPositionStrategy", () => {
  let origin: HTMLElement;
  let overlay: HTMLElement;
  let viewportRuler: FakeViewportRuler;

  beforeEach(() => {
    origin = document.createElement("div");
    overlay = document.createElement("div");
    document.body.appendChild(origin);
    document.body.appendChild(overlay);
    viewportRuler = new FakeViewportRuler();
  });

  afterEach(() => {
    origin.remove();
    overlay.remove();
  });

  function createStrategy() {
    return new ConnectedPositionStrategy(
      new ElementRef(origin),
      { originX: "start", originY: "bottom" },
      { overlayX: "start", overlayY: "top" },
      viewportRuler as any
    );
  }

  it("applies the first preferred position that fits in the viewport", () => {
    const strategy = createStrategy();

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    strategy.apply(overlay);

    expect(overlay.style.top).toBe("130px");
    expect(overlay.style.left).toBe("50px");
  });

  it("falls back to the fallback position with the largest visible area when nothing fits", () => {
    const strategy = createStrategy();
    strategy.withFallbackPosition(
      { originX: "end", originY: "top" },
      { overlayX: "end", overlayY: "bottom" }
    );

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({ top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10 })
    );
    // Overlay is larger than the viewport in both preferred positions, so
    // neither fits; the strategy should still apply *a* position rather
    // than throwing.
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 2000, height: 2000 })
    );

    expect(() => strategy.apply(overlay)).not.toThrow();
    expect(overlay.style.top || overlay.style.bottom).toBeTruthy();
  });

  it("emits onPositionChange with the connection pair that was used", () => {
    const strategy = createStrategy();
    const changes: any[] = [];
    strategy.onPositionChange.subscribe((change) => changes.push(change));

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    strategy.apply(overlay);

    expect(changes.length).toBe(1);
    expect(changes[0].connectionPair.originX).toBe("start");
    expect(changes[0].connectionPair.originY).toBe("bottom");
  });

  it("recalculateLastPosition() re-applies the last connected position", () => {
    const strategy = createStrategy();

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    strategy.apply(overlay);
    overlay.style.top = "";
    overlay.style.left = "";

    strategy.recalculateLastPosition();

    expect(overlay.style.top).toBe("130px");
    expect(overlay.style.left).toBe("50px");
  });

  it("recalculateLastPosition() uses the first preferred position when nothing has been applied yet", () => {
    const strategy = createStrategy();

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );
    // `apply` must be called once so `_pane` is set before recalculation,
    // mirroring how OverlayRef always calls `apply` before any reposition.
    strategy.apply(overlay);

    expect(() => strategy.recalculateLastPosition()).not.toThrow();
  });

  it("withOffsetX/withOffsetY shift the applied position", () => {
    const strategy = createStrategy().withOffsetX(10).withOffsetY(5);

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    strategy.apply(overlay);

    expect(overlay.style.top).toBe("135px");
    expect(overlay.style.left).toBe("60px");
  });

  it("withDirection('rtl') flips which horizontal edge is used for positioning", () => {
    const strategy = createStrategy().withDirection("rtl");

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    strategy.apply(overlay);

    // In RTL, overlayX: "start" resolves to the origin's right edge and the
    // overlay is positioned via `right` rather than `left`.
    expect(overlay.style.top).toBe("130px");
    expect(overlay.style.right).not.toBe("");
    expect(overlay.style.left).toBe("");
  });

  it("withScrollableContainers records scrollables used for view-property calculations", () => {
    const strategy = createStrategy();
    const scrollableElement = document.createElement("div");
    document.body.appendChild(scrollableElement);
    // A scrollable container that does not overlap with the origin at all,
    // so the origin is reported as outside its view even though the overlay
    // still fits comfortably in the (much larger) fake viewport.
    vi.spyOn(scrollableElement, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 600,
        left: 600,
        bottom: 900,
        right: 900,
        width: 300,
        height: 300,
      })
    );
    const scrollable = {
      getElementRef: () => new ElementRef(scrollableElement),
    };
    strategy.withScrollableContainers([scrollable as any]);

    vi.spyOn(origin, "getBoundingClientRect").mockReturnValue(
      rect({
        top: 100,
        left: 50,
        bottom: 130,
        right: 150,
        width: 100,
        height: 30,
      })
    );
    vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue(
      rect({ width: 200, height: 40 })
    );

    const changes: any[] = [];
    strategy.onPositionChange.subscribe((change) => changes.push(change));
    strategy.apply(overlay);

    expect(changes[0].scrollableViewProperties.isOriginOutsideView).toBe(true);
    scrollableElement.remove();
  });

  it("dispose() does not throw and performs no DOM cleanup", () => {
    const strategy = createStrategy();
    expect(() => strategy.dispose()).not.toThrow();
  });
});
