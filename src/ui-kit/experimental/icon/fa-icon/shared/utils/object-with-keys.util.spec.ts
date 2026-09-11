import { objectWithKey } from "./object-with-keys.util";

describe("objectWithKey", () => {
  it("wraps a truthy scalar value under the given key", () => {
    expect(objectWithKey("size", "lg")).toEqual({ size: "lg" });
  });

  it("wraps a non-empty array under the given key", () => {
    expect(objectWithKey("classes", ["a", "b"])).toEqual({
      classes: ["a", "b"],
    });
  });

  it("returns an empty object for an empty array", () => {
    expect(objectWithKey("classes", [])).toEqual({});
  });

  it("returns an empty object for a falsy scalar value", () => {
    expect(objectWithKey("size", undefined)).toEqual({});
    expect(objectWithKey("size", "")).toEqual({});
    expect(objectWithKey("size", 0)).toEqual({});
  });
});
