/* tslint:disable */
import { Component, SimpleChange, ChangeDetectorRef, ViewChild, ElementRef, Output, Input, 
  EventEmitter, OnInit, OnChanges, forwardRef, HostListener } from '@angular/core';
import {
  FormControl, Validators, ControlValueAccessor,
  AbstractControl, NG_VALUE_ACCESSOR, ValidatorFn
} from '@angular/forms';

import { Calendar } from './calendar';
import * as moment from 'moment';

import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { SamFormControl } from '../../../../ui-kit/form-controls/sam-form-control/sam-form-control';
import { SamFormService } from '../../../../ui-kit/form-service';

type DateFormatFunction = (date: Date) => string;

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'sam-datepicker-v2',
  animations: [
    trigger('calendarAnimation', [
      transition('* => left', [
        animate(180, keyframes([
          style({ transform: 'translateX(105%)', offset: 0.5 }),
          style({ transform: 'translateX(-130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ]),
      transition('* => right', [
        animate(180, keyframes([
          style({ transform: 'translateX(-105%)', offset: 0.5 }),
          style({ transform: 'translateX(130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ],
  templateUrl: `./picker.template.html`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
  }]
})
export class DatepickerComponent extends SamFormControl implements OnInit, OnChanges, ControlValueAccessor {
  private readonly DEFAULT_FORMAT = 'MM/DD/YYYY';

  private dateVal: Date;
  // two way bindings
  @Output() dateChange = new EventEmitter<Date>();

  @Input() get date(): Date { return this.dateVal; }
  set date(val: Date) {
    this.dateVal = val;
    this.dateChange.emit(val);
  }
  // api bindings
  @Input() accentColor: string;
  @Input() altInputStyle: boolean;
  @Input() dateFormat: string | DateFormatFunction;
  @Input() fontFamily: string;
  @Input() rangeStart: Date;
  @Input() rangeEnd: Date;
  // data
  @Input() placeholder: string = 'Select a date';
  @Input() inputText: string;
  // view logic
  @Input() showCalendar: boolean;
  @Input() cancelText: string = 'Cancel';
  @Input() weekStart: number = 0;
  // events
  @Output() onSelect = new EventEmitter<Date>();
  // time
  @Input() calendarDays: Array<number>;
  @Input() currentMonth: string;
  @Input() dayNames: Array<String> = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Default order: firstDayOfTheWeek = 0
  @Input() hoveredDay: Date;
  @Input() months: Array<string>;
  dayNamesOrdered: Array<String>;
  calendar: Calendar;
  currentMonthNumber: number;
  currentYear: number;
  // animation
  animate: string;
  // colors
  colors: { [id: string]: string };
  // forms
  disabled: boolean;
  yearControl: FormControl;
  _focusableString: string =
    'a[href], area, button, select, textarea, *[tabindex], \
  input:not([type="hidden"])';
  @ViewChild('calendarpopup') calendarpopup: ElementRef;
  @ViewChild('calendarButton') calendarButton: ElementRef;

  static dateValidation() {
    const minYear = 1000;
    return (c: AbstractControl) => {
      const error = {
        dateError: {
          message: ''
        }
      };
      if (c.dirty && (c.value && c.value !== undefined)) {
        const dateM = moment(c.value);
        if (!dateM.isValid()) {
          error.dateError.message = 'Invalid date';
          return error;
        } else {
          if (dateM.get('year') < minYear) {
            error.dateError.message = 'Please enter 4 digit year';
            return error;
          }
        }
      }
      return undefined;
    };
  }

  @HostListener('document:click', ['$event']) documentClickHandler(event: MouseEvent) {
    this.handleGlobalClick(event);
  }

  constructor(
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef) {
    super(samFormService, cdr);
    this.dateFormat = this.DEFAULT_FORMAT;
    // view logic
    this.showCalendar = false;
    // colors
    this.colors = {
      'black': '#333333',
      'blue': '#1285bf',
      'lightGrey': '#f1f1f1',
      'white': '#ffffff'
    };
    this.accentColor = this.colors['blue'];
    this.altInputStyle = false;
    // time
    this.updateDayNames();

    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', ' December'
    ];

    // form controls
    this.yearControl = new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(4),
      this.yearValidator,
      this.inRangeValidator.bind(this)
    ]));
  }

  ngOnInit() {
    this.updateDayNames();
    this.syncVisualsWithDate();

    if (this.control && !this.disableValidation) {
      const validators: ValidatorFn[] = [];
      if (this.control.validator) {
        validators.push(this.control.validator);
      }
      // if (this.required) {
      //     //validators.push(SamDateComponent.dateRequired());
      // }
      validators.push(DatepickerComponent.dateValidation());
      this.control.setValidators(validators);
      this.control.statusChanges.subscribe(() => {
        this.wrapper.formatErrors(this.control);
      });
      this.wrapper.formatErrors(this.control);
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if ((changes['date'] || changes['dateFormat'])) {
      this.syncVisualsWithDate();
    }
    if (changes['firstDayOfTheWeek'] || changes['dayNames']) {
      this.updateDayNames();
    }
  }

  // -------------------------------------------------------------------------------- //
  // -------------------------------- State Management ------------------------------ //
  // -------------------------------------------------------------------------------- //
  /**
  * Closes the calendar and syncs visual components with selected or current date.
  * This way if a user opens the calendar with this month, scrolls to two months from now,
  * closes the calendar, then reopens it, it will open with the current month
  * or month associated with the selected date
  */
  closeCalendar(): void {
    this.showCalendar = false;
    this.syncVisualsWithDate();
    this.enablePageTabIndex();
  }

  /**
  * Sets the date values associated with the ui
  */
  private setCurrentValues(date: Date) {
    this.currentMonthNumber = date.getMonth();
    this.currentMonth = this.months[this.currentMonthNumber];

    this.currentYear = date.getFullYear();
    this.yearControl.setValue(this.currentYear);

    const calendarArray = this.calendar.monthDays(this.currentYear, this.currentMonthNumber);
    this.calendarDays = [].concat.apply([], calendarArray);
    this.calendarDays = this.filterInvalidDays(this.calendarDays);
  }

  /**
   * Update the day names order. The order can be modified with the firstDayOfTheWeek input, while 0 means that the
   * first day will be sunday.
   */
  private updateDayNames() {
    this.dayNamesOrdered = this.dayNames.slice(); // Copy DayNames with default value (weekStart = 0)
    if (this.weekStart < 0 || this.weekStart >= this.dayNamesOrdered.length) {
      // Out of range
      throw Error(`The weekStart is not in range between ${0} and ${this.dayNamesOrdered.length - 1}`);
    } else {
      this.calendar = new Calendar(this.weekStart);
      this.dayNamesOrdered = this.dayNamesOrdered.slice(this.weekStart, this.dayNamesOrdered.length)
        .concat(this.dayNamesOrdered.slice(0, this.weekStart)); // Append beginning to end
    }
  }
  syncInputWithCal() {
    if (this.inputText && this.inputText.length === 10) {
      const date = new Date(this.inputText);
      if (this.isDateValid(date) && !isNaN(date.getTime())) {
        this.date = date;
        this.syncVisualsWithDate();
      }
      this.onChange(this.inputText);
    } else if (this.inputText === '') {
      this.onChange('');
    }
  }
  /**
  * Visually syncs calendar and input to selected date or current day
  */
  syncVisualsWithDate(): void {
    if (this.date) {
      this.setInputText(this.date);
      this.setCurrentValues(this.date);
    } else {
      this.inputText = '';
      this.setCurrentValues(new Date());
    }
  }

  /**
  * Sets the currentMonth and creates new calendar days for the given month
  */
  setCurrentMonth(monthNumber: number): void {
    this.currentMonth = this.months[monthNumber];
    const calendarArray = this.calendar.monthDays(this.currentYear, this.currentMonthNumber);
    this.calendarDays = [].concat.apply([], calendarArray);
    this.calendarDays = this.filterInvalidDays(this.calendarDays);
  }

  /**
  * Sets the currentYear and FormControl value associated with the year
  */
  setCurrentYear(year: number): void {
    this.currentYear = year;
    this.yearControl.setValue(year);
  }

  /**
  * Sets the visible input text
  */
  setInputText(date: Date): void {
    let inputText = '';
    const dateFormat: string | DateFormatFunction = this.dateFormat;
    if (dateFormat === undefined || dateFormat === null) {
      inputText = moment(date).format(this.DEFAULT_FORMAT);
    } else if (typeof dateFormat === 'string') {
      inputText = moment(date).format(dateFormat);
    } else if (typeof dateFormat === 'function') {
      inputText = dateFormat(date);
    }
    this.inputText = inputText;
  }

  // -------------------------------------------------------------------------------- //
  // --------------------------------- Click Handlers ------------------------------- //
  // -------------------------------------------------------------------------------- //
  /**
  * Sets the date values associated with the calendar.
  * Triggers animation if the month changes
  */
  onArrowClick(direction: string): void {
    const currentMonth: number = this.currentMonthNumber;
    let newYear: number = this.currentYear;
    let newMonth: number;
    // sets the newMonth
    // changes newYear is necessary
    if (direction === 'left') {
      if (currentMonth === 0) {
        newYear = this.currentYear - 1;
        newMonth = 11;
      } else {
        newMonth = currentMonth - 1;
      }
    } else if (direction === 'right') {
      if (currentMonth === 11) {
        newYear = this.currentYear + 1;
        newMonth = 0;
      } else {
        newMonth = currentMonth + 1;
      }
    }
    // check if new date would be within range
    const newDate = new Date(newYear, newMonth);
    let newDateValid: boolean;
    if (direction === 'left') {
      newDateValid = !this.rangeStart || newDate.getTime() >= this.rangeStart.getTime();
    } else if (direction === 'right') {
      newDateValid = !this.rangeEnd || newDate.getTime() <= this.rangeEnd.getTime();
    }

    if (newDateValid) {
      this.setCurrentYear(newYear);
      this.currentMonthNumber = newMonth;
      this.setCurrentMonth(newMonth);
      this.triggerAnimation(direction);
    }
  }

  /**
   * Check if a date is within the range.
   * @param date The date to check.
   * @return true if the date is within the range, false if not.
   */
  isDateValid(date: Date): boolean {
    return (!this.rangeStart || date.getTime() >= this.rangeStart.getTime()) &&
      (!this.rangeEnd || date.getTime() <= this.rangeEnd.getTime());
  }

  /**
   * Filter out the days that are not in the date range.
   * @param calendarDays The calendar days
   * @return {Array} The input with the invalid days replaced by 0
   */
  filterInvalidDays(calendarDays: Array<number>): Array<number> {
    const newCalendarDays = [];
    calendarDays.forEach((day: number | Date) => {
      if (day === 0 || !this.isDateValid(<Date>day)) {
        newCalendarDays.push(0);
      } else {
        newCalendarDays.push(day);
      }
    });
    return newCalendarDays;
  }

  /**
  * Closes the calendar when the cancel button is clicked
  */
  onCancel(): void {
    this.closeCalendar();
    this.calendarButton.nativeElement.focus();
  }

  /**
  * Toggles the calendar when the date input is clicked
  */
  onInputClick(): void {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.disablePageTabIndex();
      window.setTimeout(() => {
        this.calendarButton.nativeElement.scrollIntoView();
      });
    } else {
      this.enablePageTabIndex();
    }
  }

  /**
  * Toggles the calendar when the date input is clicked
  */
  displayCalendar(): void {
    this.showCalendar = true;
    this.disablePageTabIndex();
  }

  disablePageTabIndex() {
    const els = document.querySelectorAll(this._focusableString);
    for (let i = 0; i < els.length; i++) {
      const el = els.item(i);
      const tabindex = el.getAttribute('tabindex') ? el.getAttribute('tabindex') : '0';
      if (!el.getAttribute('tabindex')) {
        el.setAttribute('data-sam-noinitial-tabindex', '1');
      }
      el.setAttribute('data-sam-tabindex', tabindex);
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
    }
  }

  enablePageTabIndex() {
    const els = document.querySelectorAll('*[data-sam-tabindex]');
    for (let i = 0; i < els.length; i++) {
      const el = els.item(i);
      if (el.hasAttribute('data-sam-noinitial-tabindex')) {
        el.removeAttribute('tabindex');
        el.removeAttribute('data-sam-noinitial-tabindex');
      } else {
        el.setAttribute('tabindex', el.getAttribute('data-sam-tabindex'));
      }
      el.removeAttribute('data-sam-tabindex');
      el.setAttribute('aria-hidden', 'false');
    }
  }

  /**
  * Returns the font color for a day
  */
  onSelectDay(day: Date): void {
    if (this.isDateValid(day)) {
      this.date = day;
      this.onSelect.emit(day);
      this.showCalendar = !this.showCalendar;
      this.syncVisualsWithDate();
      this.enablePageTabIndex();
      this.onChange(this.inputText);
      this.calendarButton.nativeElement.focus();
    }
  }

  /**
  * Sets the current year and current month if the year from
  * yearControl is valid
  */
  onYearSubmit(): void {
    if (this.yearControl.valid && +this.yearControl.value !== this.currentYear) {
      this.setCurrentYear(+this.yearControl.value);
      this.setCurrentMonth(this.currentMonthNumber);
    } else {
      this.yearControl.setValue(this.currentYear);
    }
  }

  // -------------------------------------------------------------------------------- //
  // ----------------------------------- Listeners ---------------------------------- //
  // -------------------------------------------------------------------------------- //
  /**
  * Closes the calendar if a click is not within the datepicker component
  */
  handleGlobalClick(event: MouseEvent): void {
    if (this.showCalendar && this.calendarpopup) {
      const withinElement = this.calendarpopup.nativeElement.contains(event.target);
      if (!withinElement && this.calendarButton.nativeElement !== event.target) {
        this.showCalendar = false;
        this.enablePageTabIndex();
      }
    }
  }

  // -------------------------------------------------------------------------------- //
  // ----------------------------------- Helpers ------------------------------------ //
  // -------------------------------------------------------------------------------- //
  /**
  * Returns the background color for a day
  */
  getDayBackgroundColor(day: Date): string {
    let color = this.colors['white'];
    if (this.isChosenDay(day)) {
      color = this.accentColor;
    } else if (this.isCurrentDay(day)) {
      color = this.colors['lightGrey'];
    }
    return color;
  }

  /**
  * Returns the font color for a day
  */
  getDayFontColor(day: Date): string {
    let color = this.colors['black'];
    if (this.isChosenDay(day)) {
      color = this.colors['white'];
    }
    return color;
  }

  /**
  * Returns whether a day is the chosen day
  */
  isChosenDay(day: Date): boolean {
    if (day) {
      return this.date ? day.toDateString() === this.date.toDateString() : false;
    } else {
      return false;
    }
  }

  /**
  * Returns whether a day is the current calendar day
  */
  isCurrentDay(day: Date): boolean {
    if (day) {
      return day.toDateString() === new Date().toDateString();
    } else {
      return false;
    }
  }

  /**
  * Returns whether a day is the day currently being hovered
  */
  isHoveredDay(day: Date): boolean {
    return this.hoveredDay ? this.hoveredDay === day && !this.isChosenDay(day) : false;
  }

  /**
  * Triggers an animation and resets to initial state after the duration of the animation
  */
  triggerAnimation(direction: string): void {
    this.animate = direction;
    setTimeout(() => this.animate = 'reset', 185);
  }

  // -------------------------------------------------------------------------------- //
  // ---------------------------------- Validators ---------------------------------- //
  // -------------------------------------------------------------------------------- //
  /**
  * Validates that a value is within the 'rangeStart' and/or 'rangeEnd' if specified
  */
  inRangeValidator(control: FormControl): ValidationResult {
    const value = control.value;

    if (this.currentMonthNumber) {
      const tentativeDate = new Date(+value, this.currentMonthNumber);
      if (this.rangeStart && tentativeDate.getTime() < this.rangeStart.getTime()) {
        return { 'yearBeforeRangeStart': true };
      }
      if (this.rangeEnd && tentativeDate.getTime() > this.rangeEnd.getTime()) {
        return { 'yearAfterRangeEnd': true };
      }
      return null;
    }

    return { 'currentMonthMissing': true };
  }

  /**
  * Validates that a value is a number greater than or equal to 1970
  */
  yearValidator(control: FormControl): ValidationResult {
    const value = control.value;
    const valid = !isNaN(value) && value >= 1970 && Math.floor(value) === +value;
    if (valid) {
      return null;
    }
    return { 'invalidYear': true };
  }

  writeValue(val) {
    this.inputText = val;
  }
}
