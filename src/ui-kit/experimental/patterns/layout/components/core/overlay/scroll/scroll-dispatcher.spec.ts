import { NgZone } from "@angular/core";
import { ScrollDispatcher } from "./scroll-dispatcher";
import { Scrollable } from "./scrollable";

function createFakePlatform(isBrowser = true) {
  return { isBrowser } as any;
}

function createFakeScrollable() {
  const subject = { subscribe: vi.fn() };
  let listener: (() => void) | undefined;
  return {
    elementScrolled: vi.fn(() => ({
      subscribe: (cb: () => void) => {
        listener = cb;
        return { unsubscribe: vi.fn() };
      },
    })),
    triggerScroll: () => listener && listener(),
    getElementRef: vi.fn(),
  };
}

describe("ScrollDispatcher", () => {
  let ngZone: NgZone;

  beforeEach(() => {
    ngZone = new NgZone({ enableLongStackTrace: false });
  });

  describe("register() / deregister()", () => {
    it("notifies subscribers when a registered scrollable fires a scroll event", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollable = createFakeScrollable();
      dispatcher.register(scrollable as unknown as Scrollable);

      const callback = vi.fn();
      dispatcher.scrolled(0, callback);
      scrollable.triggerScroll();

      expect(callback).toHaveBeenCalled();
    });

    it("stops notifying after deregister()", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollable = createFakeScrollable();
      dispatcher.register(scrollable as unknown as Scrollable);
      dispatcher.deregister(scrollable as unknown as Scrollable);

      expect(dispatcher.scrollableReferences.has(scrollable as any)).toBe(
        false
      );
    });

    it("deregister() is a no-op for a scrollable that was never registered", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollable = createFakeScrollable();

      expect(() =>
        dispatcher.deregister(scrollable as unknown as Scrollable)
      ).not.toThrow();
    });
  });

  describe("scrolled()", () => {
    it("returns Subscription.EMPTY when not running in a browser", () => {
      const dispatcher = new ScrollDispatcher(
        ngZone,
        createFakePlatform(false)
      );
      const callback = vi.fn();

      const subscription = dispatcher.scrolled(0, callback);

      expect(subscription.closed).toBe(true);
    });

    it("notifies subscribers on window scroll and resize events", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const callback = vi.fn();
      dispatcher.scrolled(0, callback);

      window.document.dispatchEvent(new Event("scroll"));

      expect(callback).toHaveBeenCalled();
    });

    it("shares a single global listener across multiple subscriptions", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      dispatcher.scrolled(0, vi.fn());
      dispatcher.scrolled(0, vi.fn());

      expect(dispatcher._globalSubscription).not.toBeNull();

      const globalSubscription = dispatcher._globalSubscription;
      window.document.dispatchEvent(new Event("scroll"));

      expect(dispatcher._globalSubscription).toBe(globalSubscription);
    });

    it("tears down the global listener once every subscription unsubscribes", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const subscriptionA = dispatcher.scrolled(0, vi.fn());
      const subscriptionB = dispatcher.scrolled(0, vi.fn());

      subscriptionA.unsubscribe();
      expect(dispatcher._globalSubscription).not.toBeNull();

      subscriptionB.unsubscribe();
      expect(dispatcher._globalSubscription).toBeNull();
    });

    it("keeps the global listener alive while a Scrollable is still registered", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollable = createFakeScrollable();
      dispatcher.register(scrollable as unknown as Scrollable);

      const subscription = dispatcher.scrolled(0, vi.fn());
      subscription.unsubscribe();

      expect(dispatcher._globalSubscription).not.toBeNull();
    });

    it("applies auditTime debouncing when a positive delay is provided", async () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const callback = vi.fn();
      dispatcher.scrolled(20, callback);

      dispatcher._notify();
      dispatcher._notify();

      expect(callback).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("getScrollContainers() / scrollableContainsElement()", () => {
    it("returns registered scrollables that contain the given element", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollableElement = document.createElement("div");
      const childElement = document.createElement("span");
      scrollableElement.appendChild(childElement);

      const scrollable = createFakeScrollable();
      scrollable.getElementRef.mockReturnValue({
        nativeElement: scrollableElement,
      });
      dispatcher.register(scrollable as unknown as Scrollable);

      const containers = dispatcher.getScrollContainers({
        nativeElement: childElement,
      } as any);

      expect(containers).toContain(scrollable);
    });

    it("excludes scrollables that do not contain the given element", () => {
      const dispatcher = new ScrollDispatcher(ngZone, createFakePlatform());
      const scrollableElement = document.createElement("div");
      const unrelatedElement = document.createElement("span");

      const scrollable = createFakeScrollable();
      scrollable.getElementRef.mockReturnValue({
        nativeElement: scrollableElement,
      });
      dispatcher.register(scrollable as unknown as Scrollable);

      const containers = dispatcher.getScrollContainers({
        nativeElement: unrelatedElement,
      } as any);

      expect(containers).not.toContain(scrollable);
    });
  });
});
