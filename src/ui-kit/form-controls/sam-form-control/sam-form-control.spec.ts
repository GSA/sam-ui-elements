import { SamFormControl } from "./";
import { FormControl } from "@angular/forms";
import { SamFormService } from "../../form-service";
import { ChangeDetectorRef } from "@angular/core";
import type { Mock } from "vitest";

describe("The Sam Text component", () => {
  let component: SamFormControl;
  const cdr: ChangeDetectorRef = undefined;

  beforeEach(() => {
    component = new SamFormControl(new SamFormService(), cdr);

    // Mock Inputs
    component.label = "First Name";
    component.name = "first-name";
    component.hint = "Enter your first name";
    component.errorMessage = "An error occurred";
    component.required = false;
    component.useFormService = false;
    component.disableValidation = false;
  });

  describe("ControlValueAccessor Tests", () => {
    it("should register onchange callback", () => {
      const expected = 20;

      component.registerOnChange((x) => x + 10);
      const actual = component.onChange(10);

      expect(actual).toEqual(expected);
    });

    it("should register onTouched callback", () => {
      const expected = 100;

      let actual;
      component.registerOnTouched(() => (actual = expected));
      component.onTouched();

      expect(actual).toEqual(expected);
    });

    it("should update internal value on write", () => {
      const expected = 100;

      component.writeValue(expected);
      const actual = component.value;

      expect(actual).toEqual(expected);
    });

    it("should update disabled state", () => {
      const expected = false;

      component.setDisabledState(expected);
      const actual = component.disabled;

      expect(actual).toEqual(expected);
    });
  });

  describe("Reactive form validation wiring", () => {
    let wrapperSpy: { formatErrors: Mock; clearError: Mock };

    beforeEach(() => {
      wrapperSpy = {
        formatErrors: vi.fn(),
        clearError: vi.fn(),
      };
      (component as unknown as { wrapper: typeof wrapperSpy }).wrapper =
        wrapperSpy;
      component.cdr = {
        detectChanges: vi.fn(),
      } as unknown as ChangeDetectorRef;
    });

    it("should apply default validators and subscribe to status changes when disableValidation is false", () => {
      const control = new FormControl("");
      component.control = control;
      component.disableValidation = false;
      component.useFormService = false;

      component.ngOnInit();
      control.setValue("changed");

      expect(wrapperSpy.formatErrors).toHaveBeenCalledWith(control);
    });

    it("should preserve the control's own validator when disableValidation is true", () => {
      const validator = () => null;
      const control = new FormControl("", validator);
      component.control = control;
      component.disableValidation = true;

      expect(() => component.ngOnInit()).not.toThrow();
      expect(control.validator).toBeTruthy();
    });

    it("should format errors on submit and clear on reset when useFormService is true", () => {
      const formService = new SamFormService();
      component.samFormService = formService;
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;

      component.ngOnInit();
      formService.fireSubmit(control.root);
      expect(wrapperSpy.formatErrors).toHaveBeenCalledWith(control);

      formService.fireReset(control.root);
      expect(wrapperSpy.clearError).toHaveBeenCalled();
    });

    it("should format errors on ngAfterViewInit when a control is present", () => {
      const control = new FormControl("");
      component.control = control;

      component.ngAfterViewInit();

      expect(wrapperSpy.formatErrors).toHaveBeenCalledWith(control);
    });

    it("should do nothing on ngOnInit/ngAfterViewInit when there is no control", () => {
      component.control = undefined;

      expect(() => component.ngOnInit()).not.toThrow();
      expect(() => component.ngAfterViewInit()).not.toThrow();
      expect(wrapperSpy.formatErrors).not.toHaveBeenCalled();
    });
  });
});
