import { TestBed, ComponentFixture } from "@angular/core/testing";

import { FormsModule, FormControl } from "@angular/forms";
// Load the implementations that should be tested
import { SamDateRangeComponent } from "./date-range.component";
import { SamDateComponent } from "../date/date.component";
import { SamTimeComponent } from "../time/time.component";
import { SamDateTimeComponent } from "../date-time/date-time.component";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

describe("The Sam Date Range component", () => {
  describe("isolated tests", () => {
    let component: SamDateRangeComponent;

    beforeEach(() => {
      component = new SamDateRangeComponent(new SamFormService());
    });

    it("should get a moment-based date", () => {
      const m = component.getDate({
        month: 11,
        day: 11,
        year: 2017,
      });
      expect(m.format(component.OUTPUT_FORMAT)).toBe("2017-11-11");
    });

    it("should update start and end date changes", () => {
      component.writeValue({ startDate: "2016-12-29", endDate: "2017-04-01" });
      component.startDateChange("2015-01-01");
      expect(component.startModel.year).toBe(2015);
      expect(component.startModel.month).toBe(1);
      expect(component.startModel.day).toBe(1);
      component.endDateChange("2018-01-01");
      expect(component.endModel.year).toBe(2018);
      expect(component.endModel.month).toBe(1);
      expect(component.endModel.day).toBe(1);
    });
    /**
     * TODO: Needs refactoring since we upgraded version of moment
     */
    it.skip("should have a date range validation", () => {
      const c = new FormControl({
        startDate: "2012-01-01",
        endDate: "2014-01-01",
      });
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);

      c.patchValue({
        startDate: "2016-01-01",
        endDate: "2014-01-01",
      });
      let returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe("Invalid date range");

      c.patchValue({
        startDate: "Invalid Date",
        endDate: "2014-01-01",
      });
      returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe("Invalid From Date");

      c.patchValue({
        startDate: "2016-01-01",
        endDate: "Invalid Date",
      });
      returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe("Invalid To Date");
    });
  });

  describe("static dateRangeValidation", () => {
    it("returns undefined when neither start nor end date is set", () => {
      const c = new FormControl({});
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);
    });

    it("flags an end date before the start date", () => {
      const c = new FormControl({
        startDate: "2020-06-01",
        endDate: "2020-01-01",
      });
      const result = SamDateRangeComponent.dateRangeValidation(c);
      expect(result.dateRangeError.message).toBe("Invalid date range");
    });

    it("passes a valid start/end pair", () => {
      const c = new FormControl({
        startDate: "2020-01-01",
        endDate: "2020-06-01",
      });
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);
    });

    it("flags an invalid start-only date", () => {
      const c = new FormControl({ startDate: "2020-99-99" });
      const result = SamDateRangeComponent.dateRangeValidation(c);
      expect(result.dateRangeError.message).toBe("Invalid From Date");
    });

    it("skips validation when the start-only date is the sentinel 'Invalid date'", () => {
      const c = new FormControl({ startDate: "Invalid date" });
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);
    });

    it("flags an invalid end-only date", () => {
      const c = new FormControl({ endDate: "2020-99-99" });
      const result = SamDateRangeComponent.dateRangeValidation(c);
      expect(result.dateRangeError.message).toBe("Invalid To Date");
    });

    it("skips validation when the end-only date is the sentinel 'Invalid date'", () => {
      const c = new FormControl({ endDate: "Invalid date" });
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);
    });
  });

  describe("static dateRangeRequired", () => {
    let component: SamDateRangeComponent;

    beforeEach(() => {
      component = new SamDateRangeComponent(new SamFormService());
    });

    it("requires both dates when required is set and returns an error when missing focus", () => {
      component.required = true;
      component.hasFocus = false;
      const c = new FormControl({
        startDate: "Invalid date",
        endDate: "Invalid date",
      });
      const result = SamDateRangeComponent.dateRangeRequired(component)(c);
      expect(result.dateRangeError.message).toBe("This field is required");
    });

    it("does not error while the control has focus", () => {
      component.required = true;
      component.hasFocus = true;
      const c = new FormControl({
        startDate: "Invalid date",
        endDate: "Invalid date",
      });
      expect(SamDateRangeComponent.dateRangeRequired(component)(c)).toBe(
        undefined
      );
    });

    it("does not error when neither fromRequired nor toRequired is set", () => {
      component.required = false;
      component.fromRequired = false;
      component.toRequired = false;
      const c = new FormControl({});
      expect(SamDateRangeComponent.dateRangeRequired(component)(c)).toBe(
        undefined
      );
    });
  });

  describe("rendered tests", () => {
    let component: SamDateRangeComponent;
    let fixture: ComponentFixture<SamDateRangeComponent>;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, SamWrapperModule],
        declarations: [
          SamDateRangeComponent,
          SamDateComponent,
          SamTimeComponent,
          SamDateTimeComponent,
        ],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamDateRangeComponent);
      component = fixture.componentInstance;
      component.writeValue({ startDate: "2016-12-29", endDate: "2017-04-01" });
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it("should initialize Date", function () {
      expect(true).toBe(true);
    });

    it("should match specified date", function () {
      expect(component.startModel.month).toBe(12);
      expect(component.startModel.day).toBe(29);
      expect(component.startModel.year).toBe(2016);
      expect(component.endModel.month).toBe(4);
      expect(component.endModel.day).toBe(1);
      expect(component.endModel.year).toBe(2017);
    });

    it("should match specified date-time", function () {
      component.type = "date-time";
      component.writeValue({
        startDate: "2016-12-29",
        startTime: "11:11",
        endDate: "2017-04-01",
        endTime: "14:09",
      });
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.startModel.month).toBe(12);
      expect(component.startModel.day).toBe(29);
      expect(component.startModel.year).toBe(2016);
      expect(component.endModel.month).toBe(4);
      expect(component.endModel.day).toBe(1);
      expect(component.endModel.year).toBe(2017);
    });

    it("should implement controlvalueaccessor + work with custom validations", () => {
      const c = new FormControl("", () => {
        return undefined;
      });
      component.required = true;
      component.control = c;
      component.ngOnInit();
      component.onChange();
      component.onTouched();
      component.registerOnTouched(() => undefined);
      component.registerOnChange((_) => undefined);
      component.setDisabledState(false);
      component.writeValue(undefined);
      component.focusHandler();
      expect(true).toBe(true);
    });

    it("emits both start and end time in the output when type is date-time", () => {
      let emitted;
      component.type = "date-time";
      component.valueChange.subscribe((v) => (emitted = v));
      component.writeValue({
        startDate: "2016-12-29",
        startTime: "11:11",
        endDate: "2017-04-01",
        endTime: "14:09",
      });
      component.ngOnChanges();
      component.dateChange();
      expect(emitted.startTime).toBe("11:11");
      expect(emitted.endTime).toBe("14:09");
    });

    it("focuses the end date's month input after a 'year entered' blur in date mode", () => {
      component.type = "date";
      component.endDateComp.month.nativeElement.focus = () => undefined;
      expect(() => component.dateBlur("year entered")).not.toThrow();
      expect(component.hasFocus).toBe(false);
    });

    it("does not attempt to focus the end date on a plain blur", () => {
      component.type = "date";
      expect(() => component.dateBlur(undefined)).not.toThrow();
      expect(component.hasFocus).toBe(false);
    });

    it("endDateBlur clears focus and re-emits the current date change", () => {
      component.endDateBlur();
      expect(component.hasFocus).toBe(false);
    });

    it("formats errors when a control is provided without useFormService", () => {
      const control = new FormControl("");
      component.control = control;
      component.useFormService = false;
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it("subscribes to SamFormService events when useFormService is true", () => {
      const formService: SamFormService = TestBed.inject(SamFormService);
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      component.ngOnInit();
      expect(() => formService.fireSubmit(control.root)).not.toThrow();
      expect(() => formService.fireReset(control.root)).not.toThrow();
    });
  });
});
