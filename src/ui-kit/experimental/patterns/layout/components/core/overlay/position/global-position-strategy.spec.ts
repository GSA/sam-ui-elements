import { GlobalPositionStrategy } from "./global-position-strategy";

describe("GlobalPositionStrategy", () => {
  let strategy: GlobalPositionStrategy;
  let element: HTMLElement;
  let parent: HTMLElement;

  beforeEach(() => {
    strategy = new GlobalPositionStrategy();
    parent = document.createElement("div");
    element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);
  });

  afterEach(() => {
    strategy.dispose();
    if (parent.parentNode) {
      parent.parentNode.removeChild(parent);
    }
  });

  describe("fluent setters", () => {
    it("top() sets alignItems and clears bottom offset", () => {
      strategy.bottom("10px");
      strategy.top("5px");
      strategy.apply(element);

      expect(element.style.marginTop).toBe("5px");
      expect(element.style.marginBottom).toBe("");
      expect((element.parentNode as HTMLElement).style.alignItems).toBe(
        "flex-start"
      );
    });

    it("bottom() sets alignItems and clears top offset", () => {
      strategy.top("5px");
      strategy.bottom("10px");
      strategy.apply(element);

      expect(element.style.marginBottom).toBe("10px");
      expect(element.style.marginTop).toBe("");
      expect((element.parentNode as HTMLElement).style.alignItems).toBe(
        "flex-end"
      );
    });

    it("left() sets justifyContent and clears right offset", () => {
      strategy.right("10px");
      strategy.left("5px");
      strategy.apply(element);

      expect(element.style.marginLeft).toBe("5px");
      expect(element.style.marginRight).toBe("");
      expect((element.parentNode as HTMLElement).style.justifyContent).toBe(
        "flex-start"
      );
    });

    it("right() sets justifyContent and clears left offset", () => {
      strategy.left("5px");
      strategy.right("10px");
      strategy.apply(element);

      expect(element.style.marginRight).toBe("10px");
      expect(element.style.marginLeft).toBe("");
      expect((element.parentNode as HTMLElement).style.justifyContent).toBe(
        "flex-end"
      );
    });

    it("width() sets the width", () => {
      strategy.width("200px");
      strategy.apply(element);

      expect(element.style.width).toBe("200px");
    });

    it("width('100%') resets left to flush against the viewport edge", () => {
      strategy.right("20px");
      strategy.width("100%");
      strategy.apply(element);

      expect(element.style.width).toBe("100%");
      expect(element.style.marginLeft).toBe("0px");
      expect(element.style.marginRight).toBe("");
    });

    it("height() sets the height", () => {
      strategy.height("300px");
      strategy.apply(element);

      expect(element.style.height).toBe("300px");
    });

    it("height('100%') resets top to flush against the viewport edge", () => {
      strategy.bottom("20px");
      strategy.height("100%");
      strategy.apply(element);

      expect(element.style.height).toBe("100%");
      expect(element.style.marginTop).toBe("0px");
      expect(element.style.marginBottom).toBe("");
    });

    it("centerHorizontally() centers with an optional offset", () => {
      strategy.centerHorizontally("5px");
      strategy.apply(element);

      expect(element.style.marginLeft).toBe("5px");
      expect((element.parentNode as HTMLElement).style.justifyContent).toBe(
        "center"
      );
    });

    it("centerVertically() centers with an optional offset", () => {
      strategy.centerVertically("5px");
      strategy.apply(element);

      expect(element.style.marginTop).toBe("5px");
      expect((element.parentNode as HTMLElement).style.alignItems).toBe(
        "center"
      );
    });
  });

  describe("apply()", () => {
    it("wraps the element in a cdk-global-overlay-wrapper div", () => {
      strategy.apply(element);

      const wrapper = element.parentNode as HTMLElement;
      expect(wrapper.classList.contains("cdk-global-overlay-wrapper")).toBe(
        true
      );
      expect(wrapper.parentNode).toBe(parent);
    });

    it("re-uses the same wrapper on subsequent calls", () => {
      strategy.apply(element);
      const wrapperFirst = element.parentNode;

      strategy.top("1px");
      strategy.apply(element);
      const wrapperSecond = element.parentNode;

      expect(wrapperSecond).toBe(wrapperFirst);
    });
  });

  describe("dispose()", () => {
    it("removes the wrapper element from the DOM", () => {
      strategy.apply(element);
      const wrapper = element.parentNode as HTMLElement;

      strategy.dispose();

      expect(wrapper.parentNode).toBeNull();
    });

    it("is a no-op when apply() has not been called", () => {
      expect(() => strategy.dispose()).not.toThrow();
    });

    it("is a no-op when called twice", () => {
      strategy.apply(element);
      strategy.dispose();

      expect(() => strategy.dispose()).not.toThrow();
    });
  });
});
