import { BlockScrollStrategy } from "./block-scroll-strategy";
import { FakeViewportRuler } from "../position/fake-viewport-ruler";

describe("BlockScrollStrategy", () => {
  let viewportRuler: FakeViewportRuler;
  let strategy: BlockScrollStrategy;
  let originalScrollHeight: PropertyDescriptor | undefined;
  let originalScrollWidth: PropertyDescriptor | undefined;

  beforeEach(() => {
    viewportRuler = new FakeViewportRuler();
    strategy = new BlockScrollStrategy(viewportRuler as any);
    document.documentElement.classList.remove("cdk-global-scrollblock");
    document.documentElement.style.top = "";
    document.documentElement.style.left = "";

    originalScrollHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollHeight"
    );
    originalScrollWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth"
    );
  });

  afterEach(() => {
    document.documentElement.classList.remove("cdk-global-scrollblock");
    document.documentElement.style.top = "";
    document.documentElement.style.left = "";

    if (originalScrollHeight) {
      Object.defineProperty(
        HTMLElement.prototype,
        "scrollHeight",
        originalScrollHeight
      );
    }
    if (originalScrollWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "scrollWidth",
        originalScrollWidth
      );
    }
  });

  function mockBodyOverflow(scrollHeight: number, scrollWidth: number) {
    Object.defineProperty(document.body, "scrollHeight", {
      value: scrollHeight,
      configurable: true,
    });
    Object.defineProperty(document.body, "scrollWidth", {
      value: scrollWidth,
      configurable: true,
    });
  }

  describe("enable()", () => {
    it("blocks scrolling and offsets the html element when the body overflows the viewport", () => {
      mockBodyOverflow(2000, 500);

      strategy.enable();

      expect(
        document.documentElement.classList.contains("cdk-global-scrollblock")
      ).toBe(true);
      expect(document.documentElement.style.top).toBe("0px");
      expect(document.documentElement.style.left).toBe("0px");
    });

    it("does nothing when the body does not overflow the viewport", () => {
      mockBodyOverflow(100, 100);

      strategy.enable();

      expect(
        document.documentElement.classList.contains("cdk-global-scrollblock")
      ).toBe(false);
    });

    it("does not enable twice in a row", () => {
      mockBodyOverflow(2000, 500);
      vi.spyOn(viewportRuler, "getViewportScrollPosition");

      strategy.enable();
      strategy.enable();

      expect(viewportRuler.getViewportScrollPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe("disable()", () => {
    it("restores the previous inline styles and removes the scrollblock class", () => {
      document.documentElement.style.top = "-25px";
      document.documentElement.style.left = "-10px";
      mockBodyOverflow(2000, 500);

      strategy.enable();
      strategy.disable();

      expect(document.documentElement.style.top).toBe("-25px");
      expect(document.documentElement.style.left).toBe("-10px");
      expect(
        document.documentElement.classList.contains("cdk-global-scrollblock")
      ).toBe(false);
    });

    it("is a no-op when never enabled", () => {
      expect(() => strategy.disable()).not.toThrow();
      expect(
        document.documentElement.classList.contains("cdk-global-scrollblock")
      ).toBe(false);
    });
  });
});
