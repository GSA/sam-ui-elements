import { Overlay } from "./overlay";
import { OverlayState } from "./overlay-state";
import { OverlayRef } from "./overlay-ref";

function createFakeOverlayContainer() {
  const containerElement = document.createElement("div");
  document.body.appendChild(containerElement);
  return {
    getContainerElement: vi.fn().mockReturnValue(containerElement),
  };
}

describe("Overlay", () => {
  let overlayContainer: ReturnType<typeof createFakeOverlayContainer>;
  let scrollStrategies: any;
  let positionBuilder: any;
  let overlay: Overlay;

  beforeEach(() => {
    overlayContainer = createFakeOverlayContainer();
    scrollStrategies = { noop: vi.fn().mockReturnValue({ attach: vi.fn() }) };
    positionBuilder = { global: vi.fn() };
    overlay = new Overlay(
      scrollStrategies,
      overlayContainer as never,
      null as never,
      positionBuilder,
      null as never,
      null as never,
      null as never
    );
  });

  afterEach(() => {
    document.body
      .querySelectorAll(".cdk-overlay-pane")
      .forEach((el) => el.remove());
  });

  it("returns the injected position builder via position()", () => {
    expect(overlay.position()).toBe(positionBuilder);
  });

  it("creates an OverlayRef with a pane appended to the overlay container", () => {
    const state = new OverlayState();
    const ref = overlay.create(state);

    expect(ref).toBeInstanceOf(OverlayRef);
    expect(
      overlayContainer.getContainerElement().contains(ref.overlayElement)
    ).toBe(true);
    expect(ref.overlayElement.classList.contains("cdk-overlay-pane")).toBe(
      true
    );
  });

  it("falls back to the default state when create() is called without one", () => {
    const ref = overlay.create();
    expect(ref).toBeInstanceOf(OverlayRef);
  });

  it("uses the noop scroll strategy when the state provides none", () => {
    const state = new OverlayState();
    overlay.create(state);
    expect(scrollStrategies.noop).toHaveBeenCalled();
  });

  it("uses the state's own scroll strategy when one is configured", () => {
    const state = new OverlayState();
    const customStrategy = { attach: vi.fn() };
    state.scrollStrategy = customStrategy as never;

    overlay.create(state);

    expect(scrollStrategies.noop).not.toHaveBeenCalled();
  });

  it("assigns each created pane a unique id", () => {
    const refA = overlay.create();
    const refB = overlay.create();
    expect(refA.overlayElement.id).not.toBe(refB.overlayElement.id);
  });
});
