import { faNormalizeIconSpec } from "./normalize-icon-spec.util";

describe("faNormalizeIconSpec", () => {
  it("returns null for undefined", () => {
    expect(faNormalizeIconSpec(undefined as any)).toBeNull();
  });

  it("returns null for null", () => {
    expect(faNormalizeIconSpec(null as any)).toBeNull();
  });

  it("returns the spec unchanged when it is already an IconLookup", () => {
    const lookup = { prefix: "fas", iconName: "coffee" } as any;
    expect(faNormalizeIconSpec(lookup)).toBe(lookup);
  });

  it("builds a lookup from a two-element array", () => {
    expect(faNormalizeIconSpec(["fab", "github"] as any)).toEqual({
      prefix: "fab",
      iconName: "github",
    });
  });

  it("defaults to the fas prefix for a bare icon name string", () => {
    expect(faNormalizeIconSpec("coffee" as any)).toEqual({
      prefix: "fas",
      iconName: "coffee",
    });
  });

  it("returns undefined for an array that is not exactly two elements", () => {
    expect(
      faNormalizeIconSpec(["fas", "coffee", "extra"] as any)
    ).toBeUndefined();
  });
});
