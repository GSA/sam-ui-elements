import { OverlayRef } from "../overlay-ref";
import { CloseScrollStrategy } from "./close-scroll-strategy";
import { ScrollDispatcher } from "./scroll-dispatcher";

function createFakeOverlayRef() {
  return {
    hasAttached: vi.fn().mockReturnValue(true),
    detach: vi.fn(),
  };
}

function createFakeScrollDispatcher() {
  let callback: (() => void) | undefined;
  const unsubscribe = vi.fn();
  return {
    scrolled: vi.fn((_auditTime: number, cb: () => void) => {
      callback = cb;
      return { unsubscribe };
    }),
    triggerScroll: () => callback && callback(),
    unsubscribe,
  };
}

describe("CloseScrollStrategy", () => {
  let overlayRef: ReturnType<typeof createFakeOverlayRef>;
  let scrollDispatcher: ReturnType<typeof createFakeScrollDispatcher>;
  let strategy: CloseScrollStrategy;

  beforeEach(() => {
    overlayRef = createFakeOverlayRef();
    scrollDispatcher = createFakeScrollDispatcher();
    strategy = new CloseScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
  });

  it("throws when attaching a second overlay ref", () => {
    strategy.attach(overlayRef as unknown as OverlayRef);

    expect(() =>
      strategy.attach(overlayRef as unknown as OverlayRef)
    ).toThrowError("Scroll strategy has already been attached.");
  });

  it("detaches the overlay and disables itself when a scroll occurs", () => {
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();

    scrollDispatcher.triggerScroll();

    expect(overlayRef.detach).toHaveBeenCalled();
    expect(scrollDispatcher.unsubscribe).toHaveBeenCalled();
  });

  it("does not detach an overlay that is not currently attached", () => {
    overlayRef.hasAttached.mockReturnValue(false);
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();

    scrollDispatcher.triggerScroll();

    expect(overlayRef.detach).not.toHaveBeenCalled();
  });

  it("enable() only subscribes once across multiple calls", () => {
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();
    strategy.enable();

    expect(scrollDispatcher.scrolled).toHaveBeenCalledTimes(1);
  });

  it("disable() unsubscribes and allows enable() to subscribe again", () => {
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();
    strategy.disable();

    expect(scrollDispatcher.unsubscribe).toHaveBeenCalledTimes(1);

    strategy.enable();
    expect(scrollDispatcher.scrolled).toHaveBeenCalledTimes(2);
  });

  it("disable() is a no-op when never enabled", () => {
    expect(() => strategy.disable()).not.toThrow();
  });
});
