import { OverlayContainer } from "./overlay-container";

describe("OverlayContainer", () => {
  afterEach(() => {
    document.body
      .querySelectorAll(".cdk-overlay-container")
      .forEach((el) => el.remove());
  });

  it("lazily creates the container element on first getContainerElement() call", () => {
    const container = new OverlayContainer();
    expect(document.body.querySelector(".cdk-overlay-container")).toBeNull();

    const element = container.getContainerElement();

    expect(element.classList.contains("cdk-overlay-container")).toBe(true);
    expect(document.body.contains(element)).toBe(true);
  });

  it("reuses the same container element on subsequent calls", () => {
    const container = new OverlayContainer();
    const first = container.getContainerElement();
    const second = container.getContainerElement();
    expect(first).toBe(second);
  });

  it("applies the theme class to a container created after themeClass is set", () => {
    const container = new OverlayContainer();
    container.themeClass = "my-theme";
    const element = container.getContainerElement();
    expect(element.classList.contains("my-theme")).toBe(true);
  });

  it("does nothing when themeClass is set before the container element exists", () => {
    const container = new OverlayContainer();
    expect(() => (container.themeClass = "my-theme")).not.toThrow();
    expect(container.themeClass).toBe("my-theme");
  });

  it("swaps the theme class on an already-created container element", () => {
    const container = new OverlayContainer();
    container.getContainerElement();
    container.themeClass = "theme-a";
    const element = container.getContainerElement();
    expect(element.classList.contains("theme-a")).toBe(true);

    container.themeClass = "theme-b";
    expect(element.classList.contains("theme-a")).toBe(false);
    expect(element.classList.contains("theme-b")).toBe(true);
  });

  it("removes the previous theme class without adding a new one when set to a falsy value", () => {
    const container = new OverlayContainer();
    container.getContainerElement();
    container.themeClass = "theme-a";
    const element = container.getContainerElement();

    container.themeClass = "";

    expect(element.classList.contains("theme-a")).toBe(false);
  });
});
