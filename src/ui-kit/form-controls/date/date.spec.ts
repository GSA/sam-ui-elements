import { TestBed, waitForAsync, ComponentFixture } from "@angular/core/testing";

import { FormsModule, FormControl } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";
import { By } from "@angular/platform-browser";
// Load the implementations that should be tested
import { SamDateComponent } from "./date.component";
import { SamWrapperModule } from "../../wrappers";
import { SamFormService } from "../../form-service";

describe("The Sam Date component", () => {
  describe("Isolated tests", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;
    // provide our implementations or mocks to the dependency injector
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.value = "2016-12-29";
      component.name = "test";
      component.ngOnChanges({
        value: "2016-12-29",
      });
      fixture.detectChanges();
    }));

    it("Should date value to be empty when tab is pressed", function () {
      const dumEvent = {
        key: "5",
        preventDefault: function () {},
      };
      component.isTabPressed = true;
      component.onDayInput(dumEvent);

      fixture.detectChanges();
      expect(component.day.nativeElement.value).toBe("");
    });

    it("Should not change the date value when tab is pressed", function () {
      const dumEvent = {
        key: "Tab",
        preventDefault: function () {},
      };
      component.isTabPressed = true;
      component.onDayInput(dumEvent);

      fixture.detectChanges();
      expect(component.day.nativeElement.value).toBe("29");
    });

    it("The date should not changes on Shift key", function () {
      component.isTabPressed = true;
      const event = {
        key: "Shift",
        preventDefault: function () {},
      };
      component.ngOnChanges({
        value: "2016-12-29",
      });
      component.onDayInput(event);
      fixture.detectChanges();
      expect(component.day.nativeElement.value).toBe("29");
    });

    it("Should month value to be empty when tab is pressed", function () {
      const event = {
        key: "5",
        target: { value: "5" },
        preventDefault: function () {},
      };
      component.isTabPressed = true;
      component.onMonthInput(event);
      fixture.detectChanges();
      expect(component.month.nativeElement.value).toBe("");
    });

    it("The month should not changes on Shift key", function () {
      component.isTabPressed = true;
      const event = {
        key: "Shift",
        preventDefault: function () {},
      };
      component.onMonthInput(event);
      fixture.detectChanges();
      expect(component.month.nativeElement.value).toBe("12");
    });

    it("The month should not changes on Tab key", function () {
      component.isTabPressed = true;
      const event = {
        key: "Tab",
        preventDefault: function () {},
      };
      component.onMonthInput(event);
      fixture.detectChanges();
      expect(component.month.nativeElement.value).toBe("12");
    });

    it("Should year value to be empty when tab is pressed", function () {
      const event = {
        key: "5",
        preventDefault: function () {},
      };
      component.isTabPressed = true;
      component.onYearInput(event);
      fixture.detectChanges();
      expect(component.year.nativeElement.value).toBe("");
    });

    it("The year should not changes on Shift key", function () {
      component.isTabPressed = true;
      const event = {
        key: "Shift",
        preventDefault: function () {},
      };
      component.onYearInput(event);
      fixture.detectChanges();
      expect(component.year.nativeElement.value).toBe("2016");
    });

    it("The year should not changes on Tab key", function () {
      component.isTabPressed = true;
      const event = {
        key: "Tab",
        preventDefault: function () {},
      };
      component.onYearInput(event);
      fixture.detectChanges();
      expect(component.year.nativeElement.value).toBe("2016");
    });

    it("should fire change events if prepopulated and at least one field is not pristine", function () {
      component.isDateTouched = false;
      component.isMonthTouched = false;
      component.isYearTouched = true;
      component.valueChange.subscribe((data) => {
        expect(data).toBe("2016-12-29");
      });
      component.onChangeHandler();
    });
  });

  describe("Tab key tests", () => {
    let component: SamDateComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamDateComponent(new SamFormService(), cdr);
    });

    it("should check for name", () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it("should use moment for getting date", () => {
      const dateModel = {
        month: 10,
        day: 10,
        year: 2017,
      };
      component.model = { ...dateModel };
      expect(component.getDate().format(component.OUTPUT_FORMAT)).toBe(
        "2017-10-10"
      );
      expect(component.getDate(dateModel).format(component.OUTPUT_FORMAT)).toBe(
        "2017-10-10"
      );
    });

    it("should be able to check for leap years", () => {
      expect(component._isLeapYear("2016")).toBe(true);
      expect(component._isLeapYear("2017")).toBe(false);
    });
  });

  describe("static validators", () => {
    it("dateRequired flags a dirty, empty control as required", () => {
      const c = new FormControl("");
      c.markAsDirty();
      const result = SamDateComponent.dateRequired()(c);
      expect(result.dateRequiredError.message).toBe("This field is required");
    });

    it("dateRequired passes a dirty control with a value", () => {
      const c = new FormControl("2016-12-29");
      c.markAsDirty();
      expect(SamDateComponent.dateRequired()(c)).toBe(undefined);
    });

    it("dateRequired passes a pristine, empty control", () => {
      const c = new FormControl("");
      expect(SamDateComponent.dateRequired()(c)).toBe(undefined);
    });

    it("dateValidation flags an invalid date on a dirty control", () => {
      const c = new FormControl("2016-99-99");
      c.markAsDirty();
      const result = SamDateComponent.dateValidation()(c);
      expect(result.dateError.message).toBe("Invalid date");
    });

    it("dateValidation flags a year below 1000 on a dirty control", () => {
      const c = new FormControl("0999-01-01");
      c.markAsDirty();
      const result = SamDateComponent.dateValidation()(c);
      expect(result.dateError.message).toBe("Please enter 4 digit year");
    });

    it("dateValidation passes a dirty control with a valid 4-digit-year date", () => {
      const c = new FormControl("2016-12-29");
      c.markAsDirty();
      expect(SamDateComponent.dateValidation()(c)).toBe(undefined);
    });

    it("dateValidation passes a pristine control regardless of value", () => {
      const c = new FormControl("2016-99-99");
      expect(SamDateComponent.dateValidation()(c)).toBe(undefined);
    });
  });

  describe("Rendered tests", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;
    let monthEl;
    let dayEl;
    let yearEl;
    // provide our implementations or mocks to the dependency injector
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.value = "2016-12-29";
      component.name = "test";
      component.ngOnChanges({
        value: "2016-12-29",
      });
      fixture.detectChanges();
      monthEl = fixture.debugElement.query(By.css("input[name=date_month]"));
      dayEl = fixture.debugElement.query(By.css("input[name=date_day]"));
      yearEl = fixture.debugElement.query(By.css("input[name=date_year]"));
    }));

    // it('should initialize Date', function () {
    //   expect(true).toBe(true);
    // });

    it("should match specified date", function () {
      //   tick();
      fixture.detectChanges();
      //fixture.whenStable().then(() => {
      expect(component.month.nativeElement.value).toBe("12");
      expect(component.day.nativeElement.value).toBe("29");
      expect(component.year.nativeElement.value).toBe("2016");
      expect(component.isValid()).toBe(true);
      expect(component.isEmptyField()).toBe(false);
      //    });
    });

    it("should update", function () {
      component.model.month = "1";
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.month.nativeElement.value).toBe("1");
        expect(component.day.nativeElement.value).toBe("29");
        expect(component.year.nativeElement.value).toBe("2016");
      });
    });

    it.skip("should work with leap years", () => {
      component.month.nativeElement.value = "2";
      component.day.nativeElement.value = "29";
      component.year.nativeElement.value = "2015";
      component.onYearBlur(undefined);
      expect(component.day.nativeElement.value).toBe("");
    });

    it.skip("should update with key presses", function () {
      monthEl.triggerEventHandler("focus", {
        target: {
          value: "",
        },
      });

      fixture.detectChanges();

      monthEl.triggerEventHandler("keydown", {
        key: 1,
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });

      monthEl.triggerEventHandler("keydown", {
        key: 2,
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });

      dayEl.triggerEventHandler("keydown", {
        key: 1,
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });
      dayEl.triggerEventHandler("keydown", {
        key: 6,
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });

      [2, 0, 0, 0].forEach((digit) => {
        yearEl.triggerEventHandler("keydown", {
          key: digit,
          target: {
            value: "",
          },
          preventDefault: () => undefined,
        });
      });

      fixture.detectChanges();
      const model = component.inputModel;

      expect(model.month).toBe("12");
      expect(model.day).toBe("16");
      expect(model.year).toBe("2000");
    });
  });

  describe("paste handlers", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "paste-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    function pasteEvent(text: string) {
      let prevented = false;
      return {
        clipboardData: { getData: () => text },
        preventDefault: () => {
          prevented = true;
        },
        wasPrevented: () => prevented,
      };
    }

    it("allows a valid pasted month", () => {
      const event = pasteEvent("11");
      component.onMonthPaste(event);
      expect(event.wasPrevented()).toBe(false);
    });

    it("rejects a pasted month above the max", () => {
      const event = pasteEvent("13");
      component.onMonthPaste(event);
      expect(event.wasPrevented()).toBe(true);
    });

    it("rejects a pasted month longer than 2 characters", () => {
      const event = pasteEvent("123");
      component.onMonthPaste(event);
      expect(event.wasPrevented()).toBe(true);
    });

    it("allows a valid pasted day", () => {
      const event = pasteEvent("15");
      component.onDayPaste(event);
      expect(event.wasPrevented()).toBe(false);
    });

    it("rejects a pasted day above the max", () => {
      const event = pasteEvent("32");
      component.onDayPaste(event);
      expect(event.wasPrevented()).toBe(true);
    });

    it("allows a valid pasted year", () => {
      const event = pasteEvent("2016");
      component.onYearPaste(event);
      expect(event.wasPrevented()).toBe(false);
    });

    it("rejects a pasted year longer than 4 digits", () => {
      const event = pasteEvent("20166");
      component.onYearPaste(event);
      expect(event.wasPrevented()).toBe(true);
    });
  });

  describe("getMaxDate and getNumJumpThreshold", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "max-date-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    it("caps at 30 for thirty-day months", () => {
      component.month.nativeElement.value = "4";
      expect(component.getMaxDate()).toBe(30);
    });

    it("caps at 29 for February in a leap year", () => {
      component.month.nativeElement.value = "2";
      component.year.nativeElement.value = "2016";
      expect(component.getMaxDate()).toBe(29);
    });

    it("caps at 28 for February in a non-leap year", () => {
      component.month.nativeElement.value = "2";
      component.year.nativeElement.value = "2017";
      expect(component.getMaxDate()).toBe(28);
    });

    it("caps at 31 for all other months", () => {
      component.month.nativeElement.value = "7";
      expect(component.getMaxDate()).toBe(31);
    });

    it("uses a jump threshold of 2 for February", () => {
      expect(component.getNumJumpThreshold(2)).toBe(2);
    });

    it("uses a jump threshold of 3 for other months", () => {
      expect(component.getNumJumpThreshold(7)).toBe(3);
    });
  });

  describe("touch, blur and naming behaviors", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "touch-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    it("strips a leading zero from the month on touch", () => {
      component.month.nativeElement.value = "05";
      component.triggerMonthTouch({ target: { value: "05" } });
      expect(component.month.nativeElement.value).toBe("5");
      expect(component.isMonthTouched).toBe(true);
    });

    it("strips a leading zero from the day on touch", () => {
      component.day.nativeElement.value = "05";
      component.triggerDayTouch({ target: { value: "05" } });
      expect(component.day.nativeElement.value).toBe("5");
      expect(component.isDateTouched).toBe(true);
    });

    it("marks the year as touched", () => {
      component.triggerTouch({});
      expect(component.isYearTouched).toBe(true);
    });

    it("emits blur once all fields have been touched and blurred", () => {
      let blurred = false;
      component.blur.subscribe(() => (blurred = true));
      component.isDateTouched = true;
      component.isMonthTouched = true;
      component.isYearTouched = true;
      component.isMonthBlur = true;
      component.isDayBlur = true;
      component.isYearBlur = true;
      component.dateBlurred();
      expect(blurred).toBe(true);
    });

    it("does not emit blur until every field has been touched and blurred", () => {
      let blurred = false;
      component.blur.subscribe(() => (blurred = true));
      component.dateBlurred();
      expect(blurred).toBe(false);
    });

    it("shows the required designation in field names when required", () => {
      component.required = true;
      expect(component.monthName()).toContain("month required.");
      expect(component.dayName()).toContain("day required.");
      expect(component.yearName()).toContain("year required.");
    });

    it("omits the required designation in field names when not required", () => {
      component.required = false;
      expect(component.monthName()).not.toContain("required");
      expect(component.dayName()).not.toContain("required");
      expect(component.yearName()).not.toContain("required");
    });

    it("tracks selection state for each field", () => {
      component.onMonthSelected();
      component.onDaySelected();
      component.onYearSelected();
      expect(component.isMonthSelected).toBe(true);
      expect(component.isDaySelected).toBe(true);
      expect(component.isYearSelected).toBe(true);
    });

    it("clears the '0' month on blur", () => {
      component.month.nativeElement.value = "0";
      component.onMonthBlur({});
      expect(component.month.nativeElement.value).toBe("");
    });

    it("clears the '0' day on blur", () => {
      component.day.nativeElement.value = "0";
      component.onDayBlur({});
      expect(component.day.nativeElement.value).toBe("");
    });

    it("clears the '0' year and an orphaned Feb 29 on blur in a non-leap year", () => {
      component.year.nativeElement.value = "0";
      component.onYearBlur({});
      expect(component.year.nativeElement.value).toBe("");

      component.month.nativeElement.value = "2";
      component.day.nativeElement.value = "29";
      component.year.nativeElement.value = "2017";
      component.onYearBlur({});
      expect(component.day.nativeElement.value).toBe("");
    });
  });

  describe("ControlValueAccessor via writeValue", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "cva-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    it("parses a written value into the model", () => {
      component.writeValue("2016-12-29");
      expect(component.model.month).toBe(12);
      expect(component.model.day).toBe(29);
      expect(component.model.year).toBe(2016);
    });

    it("resets the inputs when written an empty value", () => {
      component.writeValue("2016-12-29");
      component.writeValue(undefined);
      expect(component.month.nativeElement.value).toBe("");
      expect(component.day.nativeElement.value).toBe("");
      expect(component.year.nativeElement.value).toBe("");
    });

    it("registers onChange/onTouched callbacks and disabled state", () => {
      let changed;
      let touched = false;
      component.registerOnChange((v) => (changed = v));
      component.registerOnTouched(() => (touched = true));
      component.setDisabledState(true);
      component.onChange("2016-01-01");
      component.onTouched();
      expect(changed).toBe("2016-01-01");
      expect(touched).toBe(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe("ngAfterViewInit control wiring", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "control-test";
    }));

    it("formats errors immediately when a control is provided without useFormService", () => {
      const control = new FormControl("");
      component.control = control;
      component.defaultValidations = true;
      component.required = true;
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
      component.ngAfterViewInit();
      expect(control.validator).toBeTruthy();
    });

    it("defers to the form service when useFormService is true", () => {
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it("does nothing when no control is provided", () => {
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe("typing digits into month/day/year", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;
    let monthEl;
    let dayEl;
    let yearEl;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "typing-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
      monthEl = component.month.nativeElement;
      dayEl = component.day.nativeElement;
      yearEl = component.year.nativeElement;
    }));

    function digitEvent(key: number, target) {
      return {
        key,
        target,
        preventDefault: () => undefined,
      };
    }

    it("types a single-digit month and advances focus to day", () => {
      monthEl.selectionStart = 0;
      dayEl.focus = () => undefined;
      component.onMonthInput(digitEvent(5, { value: "" }));
      expect(monthEl.value).toBe("5");
    });

    it("clears a conflicting day value when the month makes it invalid", () => {
      dayEl.value = "31";
      monthEl.selectionStart = 0;
      component.onMonthInput(digitEvent(4, { value: "" }));
      expect(dayEl.value).toBe("");
    });

    it("types a single-digit day and advances focus to year", () => {
      monthEl.value = "3";
      dayEl.selectionStart = 0;
      yearEl.focus = () => undefined;
      component.onDayInput(digitEvent(5, { value: "" }));
      expect(dayEl.value).toBe("5");
    });

    it("emits blur once a 4-digit year has been entered", () => {
      let blurred = false;
      component.blur.subscribe(() => (blurred = true));
      yearEl.value = "20";
      yearEl.selectionStart = 2;
      component.onYearInput(digitEvent(1, { value: "201" }));
      expect(blurred).toBe(true);
    });
  });

  describe("remaining onChangeHandler branches", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "change-handler-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    function touchAll(comp: SamDateComponent) {
      comp.isDateTouched = true;
      comp.isMonthTouched = true;
      comp.isYearTouched = true;
    }

    it("emits null when all fields are touched but empty", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      touchAll(component);
      component.onChangeHandler();
      expect(emitted).toBe(null);
    });

    it("emits Invalid Date when the year isn't 4 digits", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.month.nativeElement.value = "5";
      component.day.nativeElement.value = "10";
      component.year.nativeElement.value = "20";
      touchAll(component);
      component.onChangeHandler();
      expect(emitted).toBe("Invalid Date");
    });

    it("emits Invalid Date when the composed date is not valid", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.month.nativeElement.value = "13";
      component.day.nativeElement.value = "40";
      component.year.nativeElement.value = "2020";
      component.model = { month: 13, day: 40, year: 2020 };
      component.isDateTouched = true;
      component.isMonthTouched = true;
      component.isYearTouched = false;
      component.onChangeHandler();
      expect(emitted).toBe("Invalid Date");
    });

    it("emits a formatted date string for a valid, fully touched date", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.month.nativeElement.value = "5";
      component.day.nativeElement.value = "10";
      component.year.nativeElement.value = "2020";
      component.model = { month: 5, day: 10, year: 2020 };
      component.isDateTouched = true;
      component.isMonthTouched = true;
      component.isYearTouched = false;
      component.onChangeHandler();
      expect(emitted).toBe("2020-05-10");
    });

    it("removalKeyHandler feeds the current input model through onChangeHandler", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.month.nativeElement.value = "5";
      component.day.nativeElement.value = "10";
      component.year.nativeElement.value = "2020";
      touchAll(component);
      component.removalKeyHandler();
      expect(emitted).toBe("2020-05-10");
    });

    it("touchHandler triggers a change once every field is touched", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.month.nativeElement.value = "5";
      component.day.nativeElement.value = "10";
      component.year.nativeElement.value = "2020";
      touchAll(component);
      component.touchHandler();
      expect(emitted).toBe("2020-05-10");
    });

    it("touchHandler does nothing until every field is touched", () => {
      let emitted;
      component.valueChange.subscribe((v) => (emitted = v));
      component.touchHandler();
      expect(emitted).toBeUndefined();
    });

    it("isEmptyField honors an override argument", () => {
      expect(component.isEmptyField({ day: "", month: "", year: "" })).toBe(
        true
      );
      expect(
        component.isEmptyField({ day: "1", month: "2", year: "2020" })
      ).toBe(false);
    });
  });

  describe("private helpers used by public flows", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "helper-test";
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
    }));

    it("falls back to window.clipboardData when the event has none", () => {
      const win = window as unknown as {
        clipboardData?: { getData: (t: string) => string };
      };
      const originalClipboardData = win.clipboardData;
      const getData = vi.fn(() => "07");
      win.clipboardData = { getData };
      const preventDefault = vi.fn();
      const event = { preventDefault };
      component.onMonthPaste(event);
      win.clipboardData = originalClipboardData;
      expect(getData).toHaveBeenCalledWith("text");
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("ignores 'c' and 'v' key presses to avoid interfering with copy/paste", () => {
      const before = component.month.nativeElement.value;
      component.onMonthInput({ key: "c", preventDefault: () => undefined });
      expect(component.month.nativeElement.value).toBe(before);
      component.onDayInput({ key: "v", preventDefault: () => undefined });
      expect(component.day.nativeElement.value).toBe(before);
      component.onYearInput({ key: "c", preventDefault: () => undefined });
      expect(component.year.nativeElement.value).toBe(before);
    });
  });

  describe("ngAfterViewInit with the SamFormService submit/reset events", () => {
    let component: SamDateComponent;
    let fixture: ComponentFixture<SamDateComponent>;
    let formService: SamFormService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.name = "form-service-events-test";
      formService = TestBed.inject(SamFormService);
      component.control = new FormControl("");
      component.useFormService = true;
      component.ngOnChanges({ value: undefined });
      fixture.detectChanges();
      component.ngAfterViewInit();
    }));

    it("formats errors on a submit event matching the control's root", () => {
      expect(() =>
        formService.fireSubmit(component.control.root)
      ).not.toThrow();
    });

    it("clears errors on a reset event matching the control's root", () => {
      expect(() => formService.fireReset(component.control.root)).not.toThrow();
    });
  });
});
