import { faClassList, faLayerClassList } from "./classlist.util";

describe("faClassList", () => {
  const baseProps: any = {
    spin: false,
    pulse: false,
    fixedWidth: false,
    border: false,
    listItem: false,
    inverse: false,
    counter: false,
    flip: null,
    size: null,
    rotate: null,
    pull: null,
  };

  it("includes only the true boolean flags", () => {
    const classes = faClassList({
      ...baseProps,
      spin: true,
      border: true,
    });
    expect(classes).toContain("fa-spin");
    expect(classes).toContain("fa-border");
    expect(classes).not.toContain("fa-pulse");
  });

  it("includes fa-flip-horizontal when flip is horizontal", () => {
    const classes = faClassList({ ...baseProps, flip: "horizontal" });
    expect(classes).toContain("fa-flip-horizontal");
    expect(classes).not.toContain("fa-flip-vertical");
  });

  it("includes fa-flip-vertical when flip is vertical", () => {
    const classes = faClassList({ ...baseProps, flip: "vertical" });
    expect(classes).toContain("fa-flip-vertical");
    expect(classes).not.toContain("fa-flip-horizontal");
  });

  it("includes both flip classes when flip is both", () => {
    const classes = faClassList({ ...baseProps, flip: "both" });
    expect(classes).toContain("fa-flip-horizontal");
    expect(classes).toContain("fa-flip-vertical");
  });

  it("includes a size class when size is set", () => {
    const classes = faClassList({ ...baseProps, size: "lg" });
    expect(classes).toContain("fa-lg");
  });

  it("includes a rotate class when rotate is set", () => {
    const classes = faClassList({ ...baseProps, rotate: 90 });
    expect(classes).toContain("fa-rotate-90");
  });

  it("includes a pull class when pull is set", () => {
    const classes = faClassList({ ...baseProps, pull: "left" });
    expect(classes).toContain("fa-pull-left");
  });

  it("omits size/rotate/pull classes when they are null", () => {
    const classes = faClassList(baseProps);
    expect(classes.some((c) => c.startsWith("fa-rotate-"))).toBe(false);
    expect(classes.some((c) => c.startsWith("fa-pull-"))).toBe(false);
    expect(classes.some((c) => c === "fa-null")).toBe(false);
  });
});

describe("faLayerClassList", () => {
  it("includes fa-fw when fixedWidth is true", () => {
    const classes = faLayerClassList({ fixedWidth: true, size: null } as never);
    expect(classes).toContain("fa-fw");
  });

  it("omits fa-fw when fixedWidth is false", () => {
    const classes = faLayerClassList({
      fixedWidth: false,
      size: null,
    } as never);
    expect(classes).not.toContain("fa-fw");
  });

  it("includes a size class when size is set", () => {
    const classes = faLayerClassList({
      fixedWidth: false,
      size: "2x",
    } as never);
    expect(classes).toContain("fa-2x");
  });
});
