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
  });
});
