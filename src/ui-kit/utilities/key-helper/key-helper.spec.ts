import { KeyHelper } from "./key-helper";
import { mocks } from "./key-mocks";

/**
 * is(`validKeyParam`): bool
 */
const validKeyParams = [
  "enter",
  "up",
  "down",
  "left",
  "right",
  "tab",
  "esc",
  "space",
  "shift",
  "backspace",
  "delete",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
];

const keyEventProps = [
  "code",
  "key",
  "which",
  "charCode",
  "keyCode",
  "keyIdentifier",
];

function testKey(key: string) {
  return function runTest(
    property: string,
    value: string | number,
    altKeyName?: string
  ) {
    const expected = true;

    let event = prepMock(property, value);
    const actual = KeyHelper.is(altKeyName || key, event);

    expect(expected).toBe(actual);
  };
}

function prepMock(property: string, value: number | string) {
  return keyEventProps.reduce((prev, curr) => {
    if (curr !== property) {
      prev[curr] = undefined;
    } else {
      prev[curr] = value;
    }
    return prev;
  }, {});
}

function createTests(key: string) {
  let test = testKey(key);
  let value = mocks.default[key];
  let description = "Test " + key + " key";

  describe(description, () => {
    keyEventProps.forEach((prop) => {
      const description = "should check " + prop;
      if (prop === "charCode") {
        // charCode only valid on Enter for this set of Keys
        if (value.charCode !== 0) {
          it(description, () => {
            test("charCode", value.charCode);
          });
        }
      } else if (prop === "keyIdentifier") {
        // Only used by Safari, checked below
        return;
      } else {
        it(description, () => {
          test(prop, value[prop]);
        });
      }
    });

    testSafari(key);
    testMicrosoft(key);
  });
}

function testSafari(key: string) {
  it("should work in Safari", () => {
    let test = testKey(key);
    test("keyIdentifier", mocks.safari[key].keyIdentifier);
  });
}

function testMicrosoft(key: string) {
  let test = testKey(key);
  it("should work in IE", () => {
    test("key", mocks.ie[key].key);
  });
  it("should work in Edge", () => {
    test("key", mocks.edge[key].key);
  });
}

describe("Sam KeyEvent Class", () => {
  validKeyParams.forEach((key) => createTests(key));

  it("should return false if key does not match", () => {
    const expected = false;

    const down = mocks.default.down.key;
    const actual = KeyHelper.is("up", down);

    expect(expected).toBe(actual);
  });

  describe("KeyHelper getKeyCode method", () => {
    // Each case builds its own event stub. A single shared, mutated `mock`
    // object made these tests pass vacuously: every case assigned the same
    // string "asdf", so once test one had set `key`, the later cases asserted
    // `getKeyCode() === "asdf"` while still returning `key` rather than the
    // `code`/`keyIdentifier` fallback they claim to exercise. That left the
    // fallback branches covered only by whichever *other* spec file happened
    // to run first, making total branch coverage order-dependent.

    it("should return key if present", () => {
      const actual = KeyHelper.getKeyCode({
        key: "the-key",
        code: "the-code",
        keyIdentifier: "the-identifier",
      });

      expect(actual).toEqual("the-key");
    });

    it("should return code when key not present", () => {
      const actual = KeyHelper.getKeyCode({
        key: undefined,
        code: "the-code",
        keyIdentifier: "the-identifier",
      });

      expect(actual).toEqual("the-code");
    });

    it("should return keyIdentifier if present and key and\
      code are missing", () => {
      const actual = KeyHelper.getKeyCode({
        key: undefined,
        code: undefined,
        keyIdentifier: "the-identifier",
      });

      expect(actual).toEqual("the-identifier");
    });

    it("should return undefined when key, code and keyIdentifier are all missing", () => {
      const actual = KeyHelper.getKeyCode({
        key: undefined,
        code: undefined,
        keyIdentifier: undefined,
      });

      expect(actual).toBeUndefined();
    });

    it("should return undefined if event is undefined", () => {
      const expected = undefined;
      const actual = KeyHelper.getKeyCode(undefined);
      expect(expected).toEqual(actual);
    });

    it("should return undefined if event is any other type", () => {
      const expected = undefined;
      const actual = KeyHelper.getKeyCode("haha");

      expect(expected).toEqual(actual);
    });
  });

  describe("Instance methods", () => {
    let instance: KeyHelper;

    it("Should instantiate with supported keys", () => {
      const keys = [
        "enter",
        "up",
        "down",
        "left",
        "right",
        "tab",
        "esc",
        "space",
        "shift",
        "backspace",
        "delete",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ];
      const make = () => new KeyHelper(...keys);
      expect(make).not.toThrow();
    });

    it("should throw if unsupported key is passed", () => {
      const make = () => new KeyHelper("a");
      expect(make).toThrowError();
    });
  });
});
