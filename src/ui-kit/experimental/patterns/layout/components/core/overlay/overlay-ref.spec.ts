import { NgZone } from "@angular/core";
import { OverlayRef } from "./overlay-ref";
import { OverlayState } from "./overlay-state";

function createFakePortalHost() {
  return {
    attach: vi.fn().mockReturnValue("attach-result"),
    detach: vi.fn().mockResolvedValue("detach-result"),
    dispose: vi.fn(),
    hasAttached: vi.fn().mockReturnValue(false),
  };
}

function createFakeScrollStrategy() {
  return {
    attach: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
  };
}

describe("OverlayRef", () => {
  let portalHost: ReturnType<typeof createFakePortalHost>;
  let pane: HTMLElement;
  let state: OverlayState;
  let scrollStrategy: ReturnType<typeof createFakeScrollStrategy>;
  let ngZone: NgZone;
  let overlayRef: OverlayRef;

  beforeEach(() => {
    portalHost = createFakePortalHost();
    pane = document.createElement("div");
    document.body.appendChild(pane);
    state = new OverlayState();
    scrollStrategy = createFakeScrollStrategy();
    ngZone = new NgZone({ enableLongStackTrace: false });
    overlayRef = new OverlayRef(
      portalHost as any,
      pane,
      state,
      scrollStrategy as any,
      ngZone
    );
  });

  afterEach(() => {
    pane.remove();
    document.body
      .querySelectorAll(".cdk-overlay-backdrop")
      .forEach((backdrop) => backdrop.remove());
  });

  it("attaches the scroll strategy to itself on construction", () => {
    expect(scrollStrategy.attach).toHaveBeenCalledWith(overlayRef);
  });

  it("exposes the pane as overlayElement", () => {
    expect(overlayRef.overlayElement).toBe(pane);
  });

  describe("attach()", () => {
    it("delegates to the portal host and returns its result", () => {
      const portal = { templateRef: {} };
      const result = overlayRef.attach(portal as any);

      expect(portalHost.attach).toHaveBeenCalledWith(portal);
      expect(result).toBe("attach-result");
    });

    it("enables pointer events and the scroll strategy", () => {
      overlayRef.attach({} as any);

      expect(pane.style.pointerEvents).toBe("auto");
      expect(scrollStrategy.enable).toHaveBeenCalled();
    });

    it("adds a backdrop when the state requests one", () => {
      state.hasBackdrop = true;
      overlayRef.attach({} as any);

      const backdrop = document.body.querySelector(".cdk-overlay-backdrop");
      expect(backdrop).not.toBeNull();
    });

    it("does not add a backdrop by default", () => {
      overlayRef.attach({} as any);

      expect(document.body.querySelector(".cdk-overlay-backdrop")).toBeNull();
    });

    it("adds the configured panel class to the pane", () => {
      state.panelClass = "my-panel";
      overlayRef.attach({} as any);

      expect(pane.classList.contains("my-panel")).toBe(true);
    });

    it("emits on attachments() once setup is complete", () => {
      const spy = vi.fn();
      overlayRef.attachments().subscribe(spy);

      overlayRef.attach({} as any);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("detach()", () => {
    it("disables pointer events and the scroll strategy, then delegates to the portal host", async () => {
      overlayRef.attach({} as any);
      const result = await overlayRef.detach();

      expect(pane.style.pointerEvents).toBe("none");
      expect(scrollStrategy.disable).toHaveBeenCalled();
      expect(portalHost.detach).toHaveBeenCalled();
      expect(result).toBe("detach-result");
    });

    it("emits on detachments() after everything is detached", async () => {
      const spy = vi.fn();
      overlayRef.detachments().subscribe(spy);

      await overlayRef.detach();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispose()", () => {
    it("disposes the position strategy if one is set", () => {
      const positionStrategy = { apply: vi.fn(), dispose: vi.fn() };
      state.positionStrategy = positionStrategy as any;

      overlayRef.dispose();

      expect(positionStrategy.dispose).toHaveBeenCalled();
    });

    it("disables the scroll strategy and disposes the portal host", () => {
      overlayRef.dispose();

      expect(scrollStrategy.disable).toHaveBeenCalled();
      expect(portalHost.dispose).toHaveBeenCalled();
    });

    it("completes the attachments and backdropClick subjects", () => {
      const attachSpy = vi.fn();
      const detachSpy = vi.fn();
      overlayRef.attachments().subscribe({ complete: attachSpy });
      overlayRef.detachments().subscribe({ complete: detachSpy });

      overlayRef.dispose();

      expect(attachSpy).toHaveBeenCalled();
      expect(detachSpy).toHaveBeenCalled();
    });
  });

  describe("hasAttached()", () => {
    it("delegates to the portal host", () => {
      portalHost.hasAttached.mockReturnValue(true);

      expect(overlayRef.hasAttached()).toBe(true);
      expect(portalHost.hasAttached).toHaveBeenCalled();
    });
  });

  describe("backdrop click forwarding", () => {
    it("emits on backdropClick() when the backdrop element is clicked", () => {
      state.hasBackdrop = true;
      overlayRef.attach({} as any);
      const spy = vi.fn();
      overlayRef.backdropClick().subscribe(spy);

      const backdrop = document.body.querySelector(
        ".cdk-overlay-backdrop"
      ) as HTMLElement;
      backdrop.dispatchEvent(new Event("click"));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("updatePosition()", () => {
    it("applies the position strategy to the pane when one is configured", () => {
      const positionStrategy = { apply: vi.fn(), dispose: vi.fn() };
      state.positionStrategy = positionStrategy as any;

      overlayRef.updatePosition();

      expect(positionStrategy.apply).toHaveBeenCalledWith(pane);
    });

    it("does nothing when no position strategy is configured", () => {
      expect(() => overlayRef.updatePosition()).not.toThrow();
    });
  });

  describe("updateSize()", () => {
    it("applies width, height, minWidth and minHeight to the pane", () => {
      state.width = 100;
      state.height = "50%";
      state.minWidth = 10;
      state.minHeight = 0;

      overlayRef.updateSize();

      expect(pane.style.width).toBe("100px");
      expect(pane.style.height).toBe("50%");
      expect(pane.style.minWidth).toBe("10px");
      expect(pane.style.minHeight).toBe("0px");
    });
  });

  describe("getState()", () => {
    it("returns the overlay's state config", () => {
      expect(overlayRef.getState()).toBe(state);
    });
  });

  describe("detachBackdrop()", () => {
    it("is a no-op when there is no backdrop attached", () => {
      expect(() => overlayRef.detachBackdrop()).not.toThrow();
    });

    it("removes the backdrop from the DOM once the transition finishes", () => {
      state.hasBackdrop = true;
      overlayRef.attach({} as any);
      const backdrop = document.body.querySelector(
        ".cdk-overlay-backdrop"
      ) as HTMLElement;

      overlayRef.detachBackdrop();
      backdrop.dispatchEvent(new Event("transitionend"));

      expect(document.body.querySelector(".cdk-overlay-backdrop")).toBeNull();
    });
  });
});
