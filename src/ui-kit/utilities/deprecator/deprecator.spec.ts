import { Deprecator } from "./deprecator";

interface FakeParent {
  constructor: { name: string };
  [key: string]: unknown;
}

describe("Deprecator", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let tableSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    tableSpy = vi.spyOn(console, "table").mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    tableSpy.mockRestore();
  });

  it("does not warn when render is called with no deprecated members registered", () => {
    const parent: FakeParent = { constructor: { name: "TestParent" } };
    const deprecator = new Deprecator(parent);

    deprecator.render(parent);

    expect(warnSpy).not.toHaveBeenCalled();
    expect(tableSpy).not.toHaveBeenCalled();
  });

  it("warns and renders a table when a deprecated member is set on the parent", () => {
    const parent: FakeParent = {
      constructor: { name: "TestParent" },
      oldProp: "someValue",
    };
    const deprecator = new Deprecator(parent);
    deprecator.deprecate("oldProp", "newProp", "PI 1", "someValue");

    deprecator.render(parent);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("TestParent"));
    expect(tableSpy).toHaveBeenCalledWith([
      {
        deprecated: "oldProp",
        deprecatedValue: "someValue",
        use: "newProp",
        updateBy: "PI 1",
      },
    ]);
  });

  it("defaults deprecatedValue to n/a when not provided", () => {
    const parent: FakeParent = {
      constructor: { name: "TestParent" },
      oldProp: true,
    };
    const deprecator = new Deprecator(parent);
    deprecator.deprecate("oldProp", "newProp", "PI 1");

    deprecator.render(parent);

    expect(tableSpy).toHaveBeenCalledWith([
      {
        deprecated: "oldProp",
        deprecatedValue: "n/a",
        use: "newProp",
        updateBy: "PI 1",
      },
    ]);
  });

  it("filters out deprecated members that are falsy on the parent", () => {
    const parent: FakeParent = {
      constructor: { name: "TestParent" },
      oldProp: undefined,
      otherProp: "set",
    };
    const deprecator = new Deprecator(parent);
    deprecator.deprecate("oldProp", "newProp", "PI 1");
    deprecator.deprecate("otherProp", "newOtherProp", "PI 1");

    deprecator.render(parent);

    expect(tableSpy).toHaveBeenCalledWith([
      {
        deprecated: "otherProp",
        deprecatedValue: "n/a",
        use: "newOtherProp",
        updateBy: "PI 1",
      },
    ]);
  });

  it("logs the global message in addition to the warning when provided", () => {
    const parent: FakeParent = {
      constructor: { name: "TestParent" },
      oldProp: "set",
    };
    const deprecator = new Deprecator(parent, "Global deprecation notice");
    deprecator.deprecate("oldProp", "newProp", "PI 1");

    deprecator.render(parent);

    expect(warnSpy).toHaveBeenCalledWith("Global deprecation notice");
  });
});
