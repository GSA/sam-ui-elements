import { OverlayRef } from "../overlay-ref";
import { RepositionScrollStrategy } from "./reposition-scroll-strategy";
import { ScrollDispatcher } from "./scroll-dispatcher";

function createFakeOverlayRef() {
  return {
    updatePosition: vi.fn(),
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

describe("RepositionScrollStrategy", () => {
  let overlayRef: ReturnType<typeof createFakeOverlayRef>;
  let scrollDispatcher: ReturnType<typeof createFakeScrollDispatcher>;

  beforeEach(() => {
    overlayRef = createFakeOverlayRef();
    scrollDispatcher = createFakeScrollDispatcher();
  });

  it("throws when attaching a second overlay ref", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    strategy.attach(overlayRef as unknown as OverlayRef);

    expect(() =>
      strategy.attach(overlayRef as unknown as OverlayRef)
    ).toThrowError("Scroll strategy has already been attached.");
  });

  it("calls overlayRef.updatePosition() when a scroll occurs", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();

    scrollDispatcher.triggerScroll();

    expect(overlayRef.updatePosition).toHaveBeenCalled();
  });

  it("passes the configured scrollThrottle through to the dispatcher", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher,
      { scrollThrottle: 50 }
    );
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();

    expect(scrollDispatcher.scrolled).toHaveBeenCalledWith(
      50,
      expect.any(Function)
    );
  });

  it("defaults to a 0ms throttle when no config is provided", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();

    expect(scrollDispatcher.scrolled).toHaveBeenCalledWith(
      0,
      expect.any(Function)
    );
  });

  it("enable() only subscribes once across multiple calls", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();
    strategy.enable();

    expect(scrollDispatcher.scrolled).toHaveBeenCalledTimes(1);
  });

  it("disable() unsubscribes and allows enable() to subscribe again", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    strategy.attach(overlayRef as unknown as OverlayRef);
    strategy.enable();
    strategy.disable();

    expect(scrollDispatcher.unsubscribe).toHaveBeenCalledTimes(1);

    strategy.enable();
    expect(scrollDispatcher.scrolled).toHaveBeenCalledTimes(2);
  });

  it("disable() is a no-op when never enabled", () => {
    const strategy = new RepositionScrollStrategy(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    expect(() => strategy.disable()).not.toThrow();
  });
});
