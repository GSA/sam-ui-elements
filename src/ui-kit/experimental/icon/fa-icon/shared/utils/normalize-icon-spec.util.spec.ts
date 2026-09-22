import { faNormalizeIconSpec } from "./normalize-icon-spec.util";

describe("faNormalizeIconSpec", () => {
  it("returns null for undefined", () => {
    expect(faNormalizeIconSpec(undefined as never)).toBeNull();
  });

  it("returns null for null", () => {
    expect(faNormalizeIconSpec(null as never)).toBeNull();
  });

  it("returns the spec unchanged when it is already an IconLookup", () => {
    const lookup = { prefix: "fas", iconName: "coffee" } as never;
    expect(faNormalizeIconSpec(lookup)).toBe(lookup);
  });

  it("builds a lookup from a two-element array", () => {
    expect(faNormalizeIconSpec(["fab", "github"] as never)).toEqual({
      prefix: "fab",
      iconName: "github",
    });
  });

  it("defaults to the fas prefix for a bare icon name string", () => {
    expect(faNormalizeIconSpec("coffee" as never)).toEqual({
      prefix: "fas",
      iconName: "coffee",
    });
  });

  it("returns undefined for an array that is not exactly two elements", () => {
    expect(
      faNormalizeIconSpec(["fas", "coffee", "extra"] as never)
    ).toBeUndefined();
  });
});
