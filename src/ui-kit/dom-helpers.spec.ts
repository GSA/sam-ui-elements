import { ScrollHelpers } from "./dom-helpers";

describe("ScrollHelpers", () => {
  let originalOnWheel: typeof window.onwheel;
  let originalOnKeyDown: typeof document.onkeydown;

  beforeEach(() => {
    originalOnWheel = window.onwheel;
    originalOnKeyDown = document.onkeydown;
  });

  afterEach(() => {
    window.onwheel = originalOnWheel;
    document.onkeydown = originalOnKeyDown;
  });

  it("returns undefined when window is falsy", () => {
    expect(ScrollHelpers(undefined)).toBeUndefined();
  });

  it("returns disableScroll/enableScroll functions for a window object", () => {
    const helpers = ScrollHelpers(window);
    expect(typeof helpers.disableScroll).toBe("function");
    expect(typeof helpers.enableScroll).toBe("function");
  });

  it("disableScroll wires up scroll-blocking handlers and enableScroll clears them", () => {
    const helpers = ScrollHelpers(window);

    helpers.disableScroll();
    expect(typeof window.onwheel).toBe("function");
    expect(typeof document.onkeydown).toBe("function");

    helpers.enableScroll();
    expect(window.onwheel).toBeFalsy();
    expect(document.onkeydown).toBeFalsy();
  });

  it("preventDefaultForScrollKeys prevents default for arrow keys", () => {
    const helpers = ScrollHelpers(window);
    helpers.disableScroll();

    const preventDefault = vi.fn();
    (document.onkeydown as (e: KeyboardEvent) => void)({
      keyCode: 37,
      preventDefault,
    } as unknown as KeyboardEvent);
    expect(preventDefault).toHaveBeenCalled();

    helpers.enableScroll();
  });

  it("does nothing for keys that are not scroll keys", () => {
    const helpers = ScrollHelpers(window);
    helpers.disableScroll();

    const preventDefault = vi.fn();
    const result = (
      document.onkeydown as (e: KeyboardEvent) => boolean | undefined
    )({ keyCode: 65, preventDefault } as unknown as KeyboardEvent);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    helpers.enableScroll();
  });

  it("falls back to window.event when the onwheel handler fires with no event object", () => {
    const helpers = ScrollHelpers(window);
    helpers.disableScroll();

    const preventDefault = vi.fn();
    (window as any).event = { preventDefault };

    // window.onwheel is bound directly to the internal preventDefault(); call
    // it with no arguments so `e || window.event` falls through to the
    // window.event branch.
    (window.onwheel as any)();

    expect(preventDefault).toHaveBeenCalled();
    delete (window as any).event;
    helpers.enableScroll();
  });

  it("skips setting returnValue guard branches when addEventListener/removeEventListener are unavailable", () => {
    const originalAdd = window.addEventListener;
    const originalRemove = window.removeEventListener;
    (window as any).addEventListener = undefined;
    (window as any).removeEventListener = undefined;

    const helpers = ScrollHelpers(window);
    expect(() => helpers.disableScroll()).not.toThrow();
    expect(() => helpers.enableScroll()).not.toThrow();

    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });
});
