import { TestBed } from "@angular/core/testing";

import { ChangeDetectorRef } from "@angular/core";
import { By } from "@angular/platform-browser";
import {
  FormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
// Load the implementations that should be tested
import { SamPhoneEntryComponent } from "./phone-entry.component";
import { SamFormControlsModule } from "../../form-controls";
import { SamWrapperModule } from "../../wrappers";
import { SamFormService } from "../../form-service";

describe("The Sam Phone Entry component", () => {
  const maxLength = 11;
  describe("isolated tests", () => {
    let component: SamPhoneEntryComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamPhoneEntryComponent(new SamFormService(), cdr);
    });

    it("should have a prefixer for ids", () => {
      component.prefix = "test";
      expect(component.getIdentifier("dummy")).toBe("test-dummy");
    });

    it("should implement controlvalueaccessor", () => {
      component.onChange();
      component.onTouched();
      component.registerOnChange(() => undefined);
      component.registerOnTouched(() => undefined);
      component.setDisabledState(false);
      // writevalue used in rendered tests
    });

    it("should have emitters", () => {
      component.emitter.subscribe((data) => {
        expect(data).toBe("");
      });
      component.emit();
    });
  });
  describe("rendered tests", () => {
    let component: SamPhoneEntryComponent;
    let fixture: any;
    let el;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamFormControlsModule, SamWrapperModule, FormsModule],
        declarations: [SamPhoneEntryComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamPhoneEntryComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css("input"));
    });

    it("should process key presses (number)", function () {
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0, 0);
      for (let i = 0; i < maxLength; i++) {
        el.triggerEventHandler("keydown", {
          keyCode: 49,
          key: "1",
          preventDefault: () => undefined,
        });
      }

      expect(component.model).toBe("1+(111)111-1111");
    });

    it("should process key presses (backspace+misc)", function () {
      component.writeValue("1+(111)111-1111");
      fixture.detectChanges();
      el.triggerEventHandler("keydown", {
        keyCode: 8,
        preventDefault: () => undefined,
      });
      expect(component.model).toBe("1+(111)111-111_");

      // backspace w/selection
      const endSelectionRange = 4;
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0, endSelectionRange);
      el.triggerEventHandler("keydown", {
        keyCode: 8,
        preventDefault: () => undefined,
      });
      expect(component.model).toBe("_+(_11)111-111_");

      // right
      el.triggerEventHandler("keydown", {
        keyCode: 39,
        preventDefault: () => undefined,
      });
      // left
      el.triggerEventHandler("keydown", {
        keyCode: 37,
        preventDefault: () => undefined,
      });
      el.triggerEventHandler("keydown", {
        keyCode: 70,
        key: "f",
        preventDefault: () => undefined,
      });
    });

    it("should work with numbersOnly", function () {
      component.numbersOnly = true;
      component.ngOnInit();
      component.writeValue("11231231234");
      fixture.detectChanges();
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0, 0);
      for (let i = 0; i < maxLength; i++) {
        el.triggerEventHandler("keydown", {
          keyCode: 49,
          key: "1",
          preventDefault: () => undefined,
        });
      }
      expect(component.model).toBe("11111111111");
    });

    it("should work with formcontrols", function () {
      component.model = "";
      component.control = new FormControl("");
      component.ngOnInit();
      component.ngAfterViewInit();

      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0, 0);
      for (let i = 0; i < maxLength; i++) {
        el.triggerEventHandler("keydown", {
          keyCode: 49,
          key: "1",
          preventDefault: () => undefined,
        });
      }
      expect(component.model).toBe("1+(111)111-1111");
    });

    it("formats errors and calls detectChanges on control status changes when not using the form service", () => {
      component.control = new FormControl("");
      component.useFormService = false;
      component.ngOnInit();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");

      component.control.setErrors({ required: true });
      component.control.updateValueAndValidity();

      expect(formatErrorsSpy).toHaveBeenCalledWith(component.control);
    });

    it("formats errors on submit and clears them on reset when using the form service", () => {
      const formService = TestBed.inject(SamFormService);
      component.control = new FormControl("");
      component.useFormService = true;
      component.ngOnInit();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      const clearErrorSpy = vi.spyOn(component.wrapper, "clearError");

      formService.fireSubmit(component.control.root);
      expect(formatErrorsSpy).toHaveBeenCalledWith(component.control);

      formService.fireReset(component.control.root);
      expect(clearErrorSpy).toHaveBeenCalled();
    });

    it("validatePhoneNumber flags an incomplete phone number as invalid", () => {
      const validator = component.validatePhoneNumber(
        component.phoneNumberTemplate
      );
      const control = new FormControl("1+(111)___-____");

      const result: ValidationErrors | undefined = validator(
        control as AbstractControl
      );

      expect(result).toEqual({
        phoneError: { message: "Invalid phone number" },
      });
    });

    it("validatePhoneNumber returns undefined for a complete phone number", () => {
      component.model = "1+(111)111-1111";
      const validator = component.validatePhoneNumber(
        component.phoneNumberTemplate
      );
      const control = new FormControl("1+(111)111-1111");

      const result: ValidationErrors | undefined = validator(
        control as AbstractControl
      );

      expect(result).toBeUndefined();
    });

    it("writeValue() clears the model when a numbersOnly value is empty", () => {
      component.numbersOnly = true;
      component.writeValue("");
      expect(component.model).toBe("");
    });

    it("writeValue() falls back to the template when a non-numbersOnly value is empty", () => {
      component.numbersOnly = false;
      component.writeValue("");
      expect(component.model).toBe(component.phoneNumberTemplate);
    });

    it("preserves an existing control validator alongside the default one", () => {
      const customValidator = vi.fn().mockReturnValue(null);
      component.control = new FormControl("", customValidator);
      component.useDefaultValidations = true;
      component.ngOnInit();

      component.control.updateValueAndValidity();

      expect(customValidator).toHaveBeenCalled();
    });

    it("skips the default phone validator when useDefaultValidations is false", () => {
      component.control = new FormControl("1+(111)___-____");
      component.useDefaultValidations = false;
      component.ngOnInit();

      expect(component.control.errors).toBeNull();
    });

    it("formats an already-populated model with numbersOnly during ngOnInit", () => {
      component.numbersOnly = true;
      component.model = "5551234";
      component.ngOnInit();
      expect(component.phoneNumber).toContain("5551234".slice(0, 1));
    });

    it("process() moves the caret without altering the value on left/right arrow keys", () => {
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(2, 2);

      el.triggerEventHandler("keydown", {
        keyCode: 39,
        preventDefault: () => undefined,
      });

      // process() always calls updateModel() at the end (even for the
      // caret-move branches), syncing model to the still-unedited template.
      expect(component.model).toBe(component.phoneNumberTemplate);
    });

    it("process() restores the phone number value on an unrecognized key", () => {
      component.writeValue("1+(111)111-1111");
      fixture.detectChanges();
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(2, 2);

      el.triggerEventHandler("keydown", {
        keyCode: 90,
        key: "z",
        preventDefault: () => undefined,
      });

      expect(el.nativeElement.value).toBe(component.phoneNumber);
    });

    it("getPositionIncrement() wraps to pos+1 when there is no further blank slot", () => {
      const lastIndex = component.phoneNumberTemplate.length - 1;
      expect(component.getPositionIncrement(lastIndex)).toBe(lastIndex + 1);
    });

    it("getPositionDecrement() wraps to the first blank slot when there is no earlier one", () => {
      expect(component.getPositionDecrement(0)).toBe(
        component.phoneNumberTemplate.indexOf("_")
      );
    });
  });
});
