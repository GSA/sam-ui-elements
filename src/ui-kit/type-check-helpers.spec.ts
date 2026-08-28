import { isString, isObject, isArray, safeTypeOf } from "./type-check-helpers";

describe("type-check-helpers", () => {
  describe("isString", () => {
    it("returns true for strings", () => {
      expect(isString("hello")).toBe(true);
    });

    it("returns false for non-strings", () => {
      expect(isString(123)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });

  describe("isObject", () => {
    it("returns true for plain objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it("returns false for non-objects", () => {
      expect(isObject("hello")).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("returns true for arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it("returns false for non-arrays", () => {
      expect(isArray({})).toBe(false);
      expect(isArray("hello")).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });

  describe("safeTypeOf", () => {
    it("returns the object type string", () => {
      expect(safeTypeOf("hello")).toBe("[object String]");
      expect(safeTypeOf({})).toBe("[object Object]");
      expect(safeTypeOf([])).toBe("[object Array]");
      expect(safeTypeOf(123)).toBe("[object Number]");
      expect(safeTypeOf(null)).toBe("[object Null]");
      expect(safeTypeOf(undefined)).toBe("[object Undefined]");
    });
  });
});
