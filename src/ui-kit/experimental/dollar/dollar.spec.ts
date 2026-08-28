import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamDollarComponent } from "./dollar.component";
import { LabelWrapper } from "../../wrappers/label-wrapper/label-wrapper.component";
import { FormsModule, FormControl } from "@angular/forms";
import { SamFormService } from "../../form-service";
import { ChangeDetectorRef } from "@angular/core";

describe("The Sam Dollar component", () => {
  describe("isolated tests", () => {
    let component: SamDollarComponent;
    const cdr: ChangeDetectorRef = undefined;

    beforeEach(() => {
      component = new SamDollarComponent(new SamFormService(), cdr);
    });

    it("should convert a dollar-formatted string to a plain number string", () => {
      expect(component.dollarToStr("$1,234.56")).toBe("1234.56");
      expect(component.dollarToStr(null)).toBe("");
    });

    it("should round and format a plain number as a dollar string", () => {
      expect(component.strToDollar("1234.5")).toBe("$1,234.50");
      expect(component.strToDollar("")).toBe("");
    });

    it("should insert thousands separators", () => {
      expect(component.numberWithCommas("1234567.89")).toBe("1,234,567.89");
    });

    it("should round to two decimal places for currency", () => {
      expect(component.roundForCurrency(1234.005)).toBe("1234.01");
      expect(component.roundForCurrency(NaN)).toBe("");
    });
  });

  describe("rendered tests", () => {
    let component: SamDollarComponent;
    let fixture: ComponentFixture<SamDollarComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SamDollarComponent, LabelWrapper],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDollarComponent);
      component = fixture.componentInstance;
      component.label = "Award amount";
      component.name = "award-amount";
      component.id = "award-amount";
    });

    it("should throw if id is not set", () => {
      component.id = undefined;
      expect(() => component.ngOnInit()).toThrow(/requires a \[id\] parameter/);
    });

    it("should switch to plain-number display and back on focus/blur", () => {
      fixture.detectChanges();
      component.control = new FormControl("");
      component.ngOnInit();
      component.value = "$1,234.00";
      component.onFocus();
      expect(component.attrType).toBe("number");
      expect(component.value).toBe("1234.00");

      component.onLoseFocus();
      expect(component.attrType).toBe("text");
      expect(component.value).toBe("$1,234.00");
    });

    it("should do nothing on focus when value is empty or just a dollar sign", () => {
      fixture.detectChanges();
      component.value = "";
      component.onFocus();
      expect(component.attrType).toBe("text");

      component.value = "$";
      component.onFocus();
      expect(component.attrType).toBe("text");
    });

    it("should emit an empty change and blur events when value is cleared on blur", () => {
      fixture.detectChanges();
      component.control = new FormControl("");
      component.ngOnInit();
      component.value = "";
      const onBlurEmitted: boolean[] = [];
      const blurEmitted: boolean[] = [];
      component.onBlur.subscribe((v) => onBlurEmitted.push(v));
      component.blur.subscribe((v) => blurEmitted.push(v));

      component.onLoseFocus();

      expect(onBlurEmitted).toEqual([true]);
      expect(blurEmitted).toEqual([true]);
    });

    it("should not emit blur events when blurDisabled is true", () => {
      fixture.detectChanges();
      component.blurDisabled = true;
      const onBlurEmitted: boolean[] = [];
      component.onBlur.subscribe((v) => onBlurEmitted.push(v));

      component.onLoseFocus();

      expect(onBlurEmitted.length).toBe(0);
    });

    it("should block key input once the max length is exceeded for a digit key", () => {
      fixture.detectChanges();
      component.value = "12345678901234567";
      const numericEvent = {
        code: "Digit7",
        key: "7",
      } as unknown as KeyboardEvent;
      expect(component.onKeyInput(numericEvent)).toBe(false);
    });

    it("should call setErrors with required/null based on the emitted value", () => {
      fixture.detectChanges();
      const control = new FormControl("");
      component.control = control;
      const setErrorsSpy = vi.spyOn(control, "setErrors");

      component.emitChange("");
      expect(setErrorsSpy).toHaveBeenLastCalledWith({ required: true });

      component.emitChange("$5.00");
      expect(setErrorsSpy).toHaveBeenLastCalledWith(null);
    });

    it("should work with a form control and format the input value via onLoseFocus", () => {
      const c = new FormControl("", () => undefined);
      component.control = c;
      component.required = true;
      component.ngOnInit();
      component.ngAfterViewInit();

      component.value = "1500";
      component.onLoseFocus();

      expect(component.value).toBe("$1,500.00");
    });

    it("should show a hint message", () => {
      const hint = "Enter the total contract award amount";
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });

    it("should show an error message when the control's errors are formatted", () => {
      const errorMessage = "Uh-oh, something went wrong";
      const control = new FormControl("");
      control.setErrors({ customError: { message: errorMessage } });
      control.markAsDirty();
      component.control = control;
      component.ngOnInit();
      component.ngAfterViewInit();
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });

    it("should show a label", () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain("Award amount");
    });

    it("should format errors via the SamFormService submit/reset events when useFormService is true", () => {
      const samFormService = TestBed.inject(SamFormService);
      component.useFormService = true;
      const control = new FormControl("");
      component.control = control;
      fixture.detectChanges();
      component.ngOnInit();
      component.ngAfterViewInit();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      const clearErrorSpy = vi.spyOn(component.wrapper, "clearError");

      samFormService.fireSubmit(control);
      expect(formatErrorsSpy).toHaveBeenCalledWith(control);

      samFormService.fireReset(control);
      expect(clearErrorSpy).toHaveBeenCalled();
    });

    it("should unsubscribe and detach the change detector on destroy", () => {
      fixture.detectChanges();
      component.control = new FormControl("");
      component.ngOnInit();
      const detachSpy = vi.spyOn(component.cdr, "detach");
      expect(() => component.ngOnDestroy()).not.toThrow();
      expect(detachSpy).toHaveBeenCalled();
    });
  });
});
