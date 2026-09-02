import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChangeDetectorRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DatepickerComponent } from "./picker.component";
import { SamFormService } from "../../../form-service";
import { LabelWrapper } from "../../../wrappers/label-wrapper/label-wrapper.component";
import { SamInputMaskModule } from "../../input-mask";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

interface DatepickerInternals {
  updateDayNames(): void;
}

function asInternals(component: DatepickerComponent): DatepickerInternals {
  return component as unknown as DatepickerInternals;
}

describe("The picker component", () => {
  describe("isolated tests", () => {
    let component: DatepickerComponent;
    let cdr: ChangeDetectorRef;
    beforeEach(() => {
      component = new DatepickerComponent(new SamFormService(), cdr);
    });

    it("test ngOnInit", () => {
      component.ngOnInit();
      expect(component.dayNamesOrdered[0]).toBe("S");
      expect(component.dayNamesOrdered[1]).toBe("M");
      expect(component.dayNamesOrdered[2]).toBe("T");
      expect(component.dayNamesOrdered[3]).toBe("W");
      expect(component.dayNamesOrdered[4]).toBe("T");
      expect(component.dayNamesOrdered[5]).toBe("F");
      expect(component.dayNamesOrdered[6]).toBe("S");
    });

    it("should throw when weekStart is out of range", () => {
      component.weekStart = 10;
      expect(() => asInternals(component).updateDayNames()).toThrow(
        /not in range/
      );
    });

    it("should return false from yearValidator for a non-numeric or too-early year", () => {
      const control = new FormControl(1969);
      expect(component.yearValidator(control)).toEqual({ invalidYear: true });
      const nonNumeric = new FormControl("abc");
      expect(component.yearValidator(nonNumeric)).toEqual({
        invalidYear: true,
      });
    });

    it("should return null from yearValidator for a valid year", () => {
      const control = new FormControl(2020);
      expect(component.yearValidator(control)).toBeNull();
    });

    it("should identify valid dates within the configured range", () => {
      component.rangeStart = new Date(2020, 0, 1);
      component.rangeEnd = new Date(2020, 11, 31);
      expect(component.isDateValid(new Date(2020, 5, 15))).toBe(true);
      expect(component.isDateValid(new Date(2019, 11, 31))).toBe(false);
      expect(component.isDateValid(new Date(2021, 0, 1))).toBe(false);
    });

    it("should filter out invalid days into zeroes", () => {
      component.rangeStart = new Date(2020, 0, 10);
      component.rangeEnd = new Date(2020, 0, 20);
      const days = [
        new Date(2020, 0, 5),
        new Date(2020, 0, 15),
        new Date(2020, 0, 25),
      ];
      const filtered = component.filterInvalidDays(days as unknown as number[]);
      expect(filtered).toEqual([0, days[1], 0]);
    });

    it("should identify the chosen day and current day", () => {
      component.date = new Date(2020, 0, 15);
      expect(component.isChosenDay(new Date(2020, 0, 15))).toBe(true);
      expect(component.isChosenDay(new Date(2020, 0, 16))).toBe(false);
      expect(component.isChosenDay(null)).toBe(false);

      expect(component.isCurrentDay(new Date())).toBe(true);
      expect(component.isCurrentDay(new Date(2000, 0, 1))).toBe(false);
      expect(component.isCurrentDay(null)).toBe(false);
    });

    it("should return the accent color for a chosen day and light grey for the current day", () => {
      component.date = new Date(2020, 0, 15);
      expect(component.getDayBackgroundColor(new Date(2020, 0, 15))).toBe(
        component.accentColor
      );
      expect(component.getDayBackgroundColor(new Date())).toBe(
        component.colors["lightGrey"]
      );
      expect(component.getDayBackgroundColor(new Date(2000, 0, 1))).toBe(
        component.colors["white"]
      );
    });

    it("should return white font color except for the chosen day", () => {
      component.date = new Date(2020, 0, 15);
      expect(component.getDayFontColor(new Date(2020, 0, 15))).toBe(
        component.colors["white"]
      );
      expect(component.getDayFontColor(new Date(2000, 0, 1))).toBe(
        component.colors["black"]
      );
    });

    it("should report a day as hovered only when it matches hoveredDay and is not chosen", () => {
      const day = new Date(2020, 0, 15);
      component.hoveredDay = day;
      expect(component.isHoveredDay(day)).toBe(true);
      component.date = day;
      expect(component.isHoveredDay(day)).toBe(false);
    });
  });

  describe("rendered tests", () => {
    let component: DatepickerComponent;
    let fixture: ComponentFixture<DatepickerComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          SamInputMaskModule,
          NoopAnimationsModule,
        ],
        declarations: [DatepickerComponent, LabelWrapper],
        providers: [SamFormService],
      });
      fixture = TestBed.createComponent(DatepickerComponent);
      component = fixture.componentInstance;
      component.name = "start-date";
      fixture.detectChanges();
    });

    it("should show today's month/year and calendar days on init", () => {
      expect(component.calendarDays.length).toBeGreaterThan(0);
      expect(component.currentMonth).toBe(
        component.months[new Date().getMonth()]
      );
    });

    it("should toggle the calendar open/closed via onInputClick", () => {
      expect(component.showCalendar).toBe(false);
      component.onInputClick();
      expect(component.showCalendar).toBe(true);
      component.onInputClick();
      expect(component.showCalendar).toBe(false);
    });

    it("should show the calendar via displayCalendar", () => {
      component.displayCalendar();
      expect(component.showCalendar).toBe(true);
    });

    it("should close the calendar and re-focus the calendar button on cancel", () => {
      component.displayCalendar();
      const focusSpy = vi.spyOn(
        component.calendarButton.nativeElement,
        "focus"
      );
      component.onCancel();
      expect(component.showCalendar).toBe(false);
      expect(focusSpy).toHaveBeenCalled();
    });

    it("should navigate to the previous and next month with onArrowClick", () => {
      const initialMonth = component.currentMonthNumber;
      component.onArrowClick("right");
      expect(component.currentMonthNumber).toBe(
        initialMonth === 11 ? 0 : initialMonth + 1
      );
      component.onArrowClick("left");
      expect(component.currentMonthNumber).toBe(initialMonth);
    });

    it("should not navigate left past the rangeStart month", () => {
      const now = new Date();
      component.rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const initialMonth = component.currentMonthNumber;
      component.onArrowClick("left");
      expect(component.currentMonthNumber).toBe(initialMonth);
    });

    it("should not navigate right past the rangeEnd month", () => {
      const now = new Date();
      component.rangeEnd = new Date(now.getFullYear(), now.getMonth(), 28);
      const initialMonth = component.currentMonthNumber;
      component.onArrowClick("right");
      expect(component.currentMonthNumber).toBe(initialMonth);
    });

    it("should select a valid day, emit onSelect, and close the calendar", () => {
      const emitted: Date[] = [];
      component.onSelect.subscribe((d) => emitted.push(d));
      component.displayCalendar();
      const day = new Date();
      component.onSelectDay(day);
      expect(component.date).toBe(day);
      expect(emitted).toEqual([day]);
      expect(component.showCalendar).toBe(false);
    });

    it("should not select an invalid day", () => {
      component.rangeStart = new Date(2099, 0, 1);
      component.rangeEnd = new Date(2099, 11, 31);
      const day = new Date(2000, 0, 1);
      component.onSelectDay(day);
      expect(component.date).toBeUndefined();
    });

    it("should update the year and refresh the month when a valid year is submitted", () => {
      component.yearControl.setValue(2025);
      component.onYearSubmit();
      expect(component.currentYear).toBe(2025);
    });

    it("should reset the year control when an invalid year is submitted", () => {
      component.yearControl.setValue("abc");
      component.onYearSubmit();
      expect(component.yearControl.value).toBe(component.currentYear);
    });

    it("should sync the input text with the calendar for a valid 10-character date", () => {
      component.inputText = "01/01/2020";
      component.syncInputWithCal();
      expect(component.date.getFullYear()).toBe(2020);
    });

    it("should call onChange with an empty string when inputText is cleared", () => {
      const emitted: string[] = [];
      component.registerOnChange((v: string) => emitted.push(v));
      component.inputText = "";
      component.syncInputWithCal();
      expect(emitted).toEqual([""]);
    });

    // `calendarpopup` is now a non-static `@ViewChild` (see GH-666), so it
    // resolves once the `*ngIf="showCalendar"` element renders on the change
    // detection run after `displayCalendar()` flips the flag. The second
    // `detectChanges()` call lets `enablePageTabIndex`/DOM updates settle
    // before the outside click fires.
    //
    // A synthetic `{ target }` object passed directly to `handleGlobalClick`
    // cannot reproduce the real-browser hit-testing defect (Defect 2 in
    // GH-666) where a click on the calendar icon lands on its `.sr-only`
    // child span rather than the icon itself -- jsdom has no layout engine to
    // hit-test against, so this unit spec only exercises the containment
    // check's positive case (a click target that is unambiguously outside
    // both the popup and the button). The real-browser scenario is covered
    // by `test-app/e2e/datepicker.spec.ts`, per GH-666's acceptance criteria.
    it("should close the calendar when clicking outside of it", () => {
      component.displayCalendar();
      fixture.detectChanges();
      fixture.detectChanges();
      const outsideEl = document.createElement("div");
      document.body.appendChild(outsideEl);
      component.handleGlobalClick({
        target: outsideEl,
      } as unknown as MouseEvent);
      expect(component.showCalendar).toBe(false);
      document.body.removeChild(outsideEl);
    });

    // Exercises the containment branch directly (rather than vacuously
    // early-returning as it did before GH-666's fix): the calendar button
    // itself is contained within itself, so `handleGlobalClick` must treat a
    // click on it as "not outside" and leave the calendar open.
    it("should not close the calendar when clicking the calendar button", () => {
      component.displayCalendar();
      fixture.detectChanges();
      component.handleGlobalClick({
        target: component.calendarButton.nativeElement,
      } as unknown as MouseEvent);
      expect(component.showCalendar).toBe(true);
    });

    it("should format the input text using a custom dateFormat function", () => {
      component.dateFormat = (d: Date) => `custom-${d.getFullYear()}`;
      component.date = new Date(2020, 0, 1);
      component.syncVisualsWithDate();
      expect(component.inputText).toBe("custom-2020");
    });

    it("should validate the static dateValidation for an invalid date string", () => {
      const validatorFn = DatepickerComponent.dateValidation();
      const control = new FormControl("not-a-date");
      control.markAsDirty();
      const result = validatorFn(control);
      expect(result.dateError.message).toBe("Invalid date");
    });

    it("should validate the static dateValidation for a year below the minimum", () => {
      const validatorFn = DatepickerComponent.dateValidation();
      const control = new FormControl("01/01/0999");
      control.markAsDirty();
      const result = validatorFn(control);
      expect(result.dateError.message).toBe("Please enter 4 digit year");
    });

    it("should pass dateValidation for a clean control", () => {
      const validatorFn = DatepickerComponent.dateValidation();
      const control = new FormControl("");
      const result = validatorFn(control);
      expect(result).toBeUndefined();
    });
  });
});
