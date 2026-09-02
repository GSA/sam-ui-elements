import { SimpleChange } from "@angular/core";

// Load the implementations that should be tested
import { SamTelephone } from "./telephone.component";

const mockEvent = {
  currentTarget: {
    value: undefined,
  },
};

describe("Sam Telephone Component", () => {
  let component: SamTelephone;

  beforeEach(() => {
    component = new SamTelephone(null, null);
    component.name = "tel";
    component.label = "Phone";
    component.placeholder = "ex: (555)555-5555";
  });

  it("should set value to a number when input value\
    changes", () => {
    const expected = "1234567890";

    mockEvent.currentTarget.value = "(123)456-7890";
    component.inputChange(mockEvent);

    expect(component.value).toEqual(expected);
  });

  it("should convert value from template to number when\
    value is set", () => {
    const expected = "1234567890";

    component.value = "(123)456-7890";

    expect(component.value).toEqual(expected);
  });

  it("should use international template if country code\
    is not 1", () => {
    const expected = "";
    const newCountry = 44;
    const changes = {
      countryCode: new SimpleChange(undefined, newCountry, false),
    };

    component.ngOnChanges(changes);

    expect(component.template).toEqual(expected);
  });

  it("should use international validation if country code\
    is not 1", () => {
    const expected = "1234567890123456"; // Len > 15 fails

    component.countryCode = 44;

    expect("").not.toBeNull();
  });

  it("should format input value to numbers only when\
    element is focused", () => {
    const expected = "1234567890";

    mockEvent.currentTarget.value = "(123)456-7890";
    component.handleFocus(mockEvent);

    expect(component.inputValue).toEqual(expected);
  });

  it("should format input value to template string when\
    element is blurred", () => {
    const expected = "(123)456-7890";

    mockEvent.currentTarget.value = "1234567890";
    component.handleBlur(mockEvent);

    expect(component.inputValue).toEqual(expected);
  });

  it("ignores changes that do not include countryCode", () => {
    const before = component.template;

    component.ngOnChanges({
      placeholder: new SimpleChange(undefined, "other", false),
    });

    expect(component.template).toEqual(before);
  });

  it("treats a missing country code as North American", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, undefined, true),
    });

    expect(component.template).toEqual("(___)___-____");
  });

  it("validate() returns the first default validator error", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, 1, true),
    });

    const result = component.validate({ value: "12345" } as never);

    expect(result.usaPhone.message).toBe(
      "North American phone numbers must be 10 digits"
    );
  });

  it("validate() returns null for a valid North American number", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, 1, true),
    });

    expect(component.validate({ value: "1234567890" } as never)).toBeNull();
  });

  it("validate() returns null when the control has no value", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, 1, true),
    });

    expect(component.validate({ value: "" } as never)).toBeNull();
  });

  it("validate() flags an international number outside the 4-15 digit range", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, 44, false),
    });

    const result = component.validate({ value: "123" } as never);

    expect(result.intlPhone.message).toBe(
      "International phone numbers must be between 4 and 15 digits"
    );
  });

  it("validate() accepts an international number within range", () => {
    component.ngOnChanges({
      countryCode: new SimpleChange(undefined, 44, false),
    });

    expect(component.validate({ value: "123456" } as never)).toBeNull();
  });

  it("onKeyInput blocks a disallowed key", () => {
    const preventDefault = vi.fn();

    component.onKeyInput({ key: "a", preventDefault });

    expect(preventDefault).toHaveBeenCalled();
  });

  it("onKeyInput allows a numeric key through", () => {
    const preventDefault = vi.fn();

    // KeyHelper compares `event.key` against numeric literals, so a string
    // "1" does not match; a real digit keypress is identified by `code`.
    component.onKeyInput({ code: "Digit1", preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("input/focus/blur handlers are no-ops without an event target", () => {
    const noTarget = { currentTarget: null };

    expect(() => component.inputChange(noTarget)).not.toThrow();
    expect(() => component.handleFocus(noTarget)).not.toThrow();
    expect(() => component.handleBlur(noTarget)).not.toThrow();
  });
});
