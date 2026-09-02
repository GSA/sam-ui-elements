import {
  ViewportRuler,
  VIEWPORT_RULER_PROVIDER_FACTORY,
} from "./viewport-ruler";
import { ScrollDispatcher } from "../scroll/scroll-dispatcher";

function createFakeScrollDispatcher() {
  let callback: (() => void) | undefined;
  return {
    scrolled: vi.fn((_delay: number, cb: () => void) => {
      callback = cb;
      return { unsubscribe: vi.fn() };
    }),
    trigger: () => callback && callback(),
  };
}

describe("ViewportRuler", () => {
  let scrollDispatcher: ReturnType<typeof createFakeScrollDispatcher>;
  let ruler: ViewportRuler;

  beforeEach(() => {
    scrollDispatcher = createFakeScrollDispatcher();
    ruler = new ViewportRuler(scrollDispatcher as unknown as ScrollDispatcher);
  });

  it("subscribes to the scroll dispatcher on construction", () => {
    expect(scrollDispatcher.scrolled).toHaveBeenCalledWith(
      0,
      expect.any(Function)
    );
  });

  it("re-caches the viewport geometry when the scroll dispatcher fires", () => {
    const spy = vi.spyOn(ruler, "_cacheViewportGeometry");
    scrollDispatcher.trigger();
    expect(spy).toHaveBeenCalled();
  });

  describe("getViewportRect()", () => {
    it("computes and caches the geometry when no rect is cached yet", () => {
      const rect = ruler.getViewportRect();
      expect(rect.width).toBe(window.innerWidth);
      expect(rect.height).toBe(window.innerHeight);
      expect(typeof rect.left).toBe("number");
      expect(typeof rect.top).toBe("number");
    });

    it("uses the provided documentRect instead of recomputing", () => {
      const fakeRect = { top: -10, left: -5 } as ClientRect;
      const rect = ruler.getViewportRect(fakeRect);
      expect(rect.top).toBe(10);
      expect(rect.left).toBe(5);
    });

    it("falls back to 0 for top when the scroll position resolves to 0", () => {
      const fakeRect = { top: 0, left: 0 } as ClientRect;
      const rect = ruler.getViewportRect(fakeRect);
      expect(rect.top).toBe(0);
    });
  });

  describe("getViewportScrollPosition()", () => {
    it("caches geometry first when no documentRect is passed", () => {
      const spy = vi.spyOn(ruler, "_cacheViewportGeometry");
      ruler.getViewportScrollPosition();
      expect(spy).toHaveBeenCalled();
    });

    it("derives top/left from the negative documentRect values when non-zero", () => {
      const fakeRect = { top: -20, left: -15 } as ClientRect;
      const position = ruler.getViewportScrollPosition(fakeRect);
      expect(position.top).toBe(20);
      expect(position.left).toBe(15);
    });

    it("falls back through body/window/documentElement scroll values when the rect is at 0,0", () => {
      const fakeRect = { top: 0, left: 0 } as ClientRect;
      const position = ruler.getViewportScrollPosition(fakeRect);
      expect(typeof position.top).toBe("number");
      expect(typeof position.left).toBe("number");
    });
  });

  describe("_cacheViewportGeometry()", () => {
    it("stores the document element's bounding client rect", () => {
      ruler._cacheViewportGeometry();
      const rect = ruler.getViewportRect();
      expect(rect).toBeDefined();
    });
  });
});

describe("VIEWPORT_RULER_PROVIDER_FACTORY", () => {
  it("returns the parent ruler when one is provided", () => {
    const scrollDispatcher = createFakeScrollDispatcher();
    const parent = new ViewportRuler(
      scrollDispatcher as unknown as ScrollDispatcher
    );
    expect(
      VIEWPORT_RULER_PROVIDER_FACTORY(
        parent,
        scrollDispatcher as unknown as ScrollDispatcher
      )
    ).toBe(parent);
  });

  it("creates a new ViewportRuler when no parent ruler exists", () => {
    const scrollDispatcher = createFakeScrollDispatcher();
    const result = VIEWPORT_RULER_PROVIDER_FACTORY(
      null as any,
      scrollDispatcher as unknown as ScrollDispatcher
    );
    expect(result).toBeInstanceOf(ViewportRuler);
  });
});
