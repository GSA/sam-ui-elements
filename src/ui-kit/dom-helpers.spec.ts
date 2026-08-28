import { ScrollHelpers } from "./dom-helpers";

describe("ScrollHelpers", () => {
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

  it("preventDefaultForScrollKeys prevents default for arrow/page/space/home/end keys", () => {
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
});
