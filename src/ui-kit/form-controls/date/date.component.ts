import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  forwardRef
} from '@angular/core';

import * as moment from 'moment/moment';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { SamFormService } from '../../form-service';

import {
  KeyHelper
} from '../../utilities/key-helper/key-helper';

/**
 * The <sam-date> component is a Date entry portion of a form
 */
@Component({
  selector: 'sam-date',
  templateUrl: 'date.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamDateComponent),
    multi: true
  }]
})
export class SamDateComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  /**
  * Sets the general error message for component
  */
  @Input() public errorMessage: string = '';
  /**
  * Sets the name attribute for component
  */
  @Input() public name: string = '';
  /**
  * Sets the label text
  */
  @Input() public label: string = '';
  /**
  * Toggles whether a "required" designation is shown
  */
  @Input() public required: boolean = false;
  /**
  * Sets the helpful hint text
  */
  @Input() public hint: string = '';
  /**
  * Sets the disabled status of component, defaults to false
  */
  @Input() public disabled: boolean = false;
  /**
  * Deprecated - Sets the current value of the form control
  */
  @Input() public value: string;
  /**
   * Toggles default component validations
   */
  @Input() public defaultValidations: boolean = false;
  /**
  * Passes in the Angular FormControl
  */
  @Input() public control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() public useFormService: boolean;
  /**
  * Deprecated - Event emitted when value changes
  */
  @Output() public valueChange = new EventEmitter<any>();
  /**
  * (deprecated) Event emitted when form control loses focus
  */
  @Output() public blurEvent = new EventEmitter<any>();
  /**
  * Event emitted when form control loses focus
  */
  @Output() public blur = new EventEmitter<any>();

  @Output() public focus = new EventEmitter<any>();
  @ViewChild('month', {static: true}) public month;
  @ViewChild('day', {static: true}) public day;
  @ViewChild('year', {static: true}) public year;
  @ViewChild('wrapper', {static: true}) public wrapper;
  public allowChars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'backspace', 'left', 'right', 'tab', 'delete'
  ];

  public model: any = {
    month: undefined,
    day: undefined,
    year: undefined
  };
  public INPUT_FORMAT: string = 'Y-M-D';
  public OUTPUT_FORMAT: string = 'YYYY-MM-DD';
  private thirtyDayMonths = [4, 6, 9, 11];
  private nonFebruaryDays = [30, 31];
  private maxMonth = 12;
  private maxDay = 31;

  public isTabPressed: boolean = false;
  public isMonthTouched: boolean = false;
  public isYearTouched: boolean = false;
  public isDateTouched: boolean = false;
  public isYearBlur: boolean = false;
  public isDayBlur: boolean = false;
  public isMonthBlur: boolean = false;
  public isYearSelected: boolean = false;
  public isDaySelected: boolean = false;
  public isMonthSelected: boolean = false;
  private keys: KeyHelper = new KeyHelper(...this.allowChars);

  get inputModel() {
    return {
      day: this.day.nativeElement.value,
      month: this.month.nativeElement.value,
      year: this.year.nativeElement.value
    };
  }

  static dateRequired() {
    return (c: AbstractControl) => {
      if (c.dirty && !c.value) {
        return {
          dateRequiredError: {
            message: 'This field is required'
          }
        };
      }
      return undefined;
    };
  }

  static dateValidation() {
    // Does this code even run?!
    // Where is c getting passed in?
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

  onChange: any = () => undefined;
  onTouched: any = () => undefined;

  constructor(private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamDateComponent required a name for 508 compliance');
    }
  }

  ngAfterViewInit(){
    if (this.control) {
      const validators: ValidatorFn[] = [];
      if (this.control.validator) {
        validators.push(this.control.validator);
      }
      if (this.defaultValidations) {
        if (this.required) {
          validators.push(SamDateComponent.dateRequired());
        }
        validators.push(SamDateComponent.dateValidation());
      }
      this.control.setValidators(validators);

      if (!this.useFormService) {
        this.control.statusChanges.subscribe(() => {
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
      } else {
        this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
          if ((!evt.root || evt.root === this.control.root)
            && evt.eventType && evt.eventType === 'submit') {
            this.wrapper.formatErrors(this.control);
          } else if ((!evt.root || evt.root === this.control.root)
            && evt.eventType && evt.eventType === 'reset') {
            this.wrapper.clearError();
          }
        });
      }
    }
  }

  ngOnChanges(changes) {
    if (changes && changes['value']) {
      this.parseValueString();
    }
  }

  parseValueString() {
    if (this.value) {
      // use the forgiving format (that doesn't need 0 
      // padding) for inputs
      const m = moment(this.value, this.INPUT_FORMAT);
      if (m.isValid()) {
        const monthVal = m.month() + 1;
        const dateVal = m.date();
        this.model.month = monthVal;
        this.model.day = dateVal;
        this.model.year = m.year();
      }
    } else {
      this.model.month = '';
      this.model.day = '';
      this.model.year = '';

      this.month.nativeElement.value = '';
      this.day.nativeElement.value = '';
      this.year.nativeElement.value = '';
    }
  }

  getDate(override = undefined) {
    const obj = override ? override : this.model;
    return moment([obj.year, obj.month - 1, obj.day]);
  }

  onMonthPaste(event) {
    const text = this._getClipboardText(event);
    if (text) {
      if (text.length > 2) {
        event.preventDefault();
      }
      const val = parseInt(text, undefined);
      if (val < 1 || val > this.maxMonth) {
        event.preventDefault();
      }
    }
  }

  onDayPaste(event) {
    const text = this._getClipboardText(event);
    if (text) {
      if (text.length > 2) {
        event.preventDefault();
      }
      const val = parseInt(text, undefined);
      if (val < 1 || val > this.maxDay) {
        event.preventDefault();
      }
    }
  }

  onYearPaste(event) {
    const text = this._getClipboardText(event);
    const validYearLength = 4;
    if (text) {
      if (text.length > validYearLength) {
        event.preventDefault();
      }
    }
  }

  onMonthBlur(event) {
    this.isMonthBlur = true;
    if (this.month.nativeElement.value === '0') {
      this.month.nativeElement.value = '';
    }
  }

  onMonthInput(event: any) {
    const key = KeyHelper.getKeyCode(event);
    let dupModel;
    if (this._checkCopyPasteChar(key)) {
      return;
    }
    if (this.isTabPressed && event && !(KeyHelper.is('shift', event)) && !(KeyHelper.is('tab', event)) || this.isMonthSelected) {
      this.month.nativeElement.value = '';
    }
    this.isTabPressed = KeyHelper.is('tab', event);
    this.isMonthSelected = false;
    const inputNum = KeyHelper.getNumberFromKey(event);

    const possibleNum = this.getPossibleNum(this.month.nativeElement, event);
    if (possibleNum > this.maxMonth
      || !this.keys.isAllowed(event)) {
      event.preventDefault();
      return;
    }

    if (inputNum !== undefined) {
      if (event.target.value.length === 1 ||
        (event.target.value.length === 0 && possibleNum > 1)) {
        if (this.day.nativeElement.value
          && this._shouldClearDayInput(possibleNum)) {
          this.day.nativeElement.value = '';
        }
        this.day.nativeElement.focus();
      }
      this.month.nativeElement.value = possibleNum;
      dupModel = this.inputModel;
      event.preventDefault();
    }
    this.onChangeHandler(dupModel);
  }

  getPossibleNum(item, event): number {
    let possibleNum;
    const inputNum = KeyHelper.getNumberFromKey(event);
    if (this.keys.isAllowed(event)) {
      const position = parseInt(item.selectionStart, 10);
      possibleNum = item.value.substring(0, position) + inputNum + item.value.substring(position);
    }
    return parseInt(possibleNum, 10);
  }

  onDayBlur(event) {
    this.isDayBlur = true;
    if (this.day.nativeElement.value === '0') {
      this.day.nativeElement.value = '';
    }
  }

  onDayInput(event) {
    const key = KeyHelper.getKeyCode(event);
    if (this._checkCopyPasteChar(key)) {
      return;
    }
    if (this.isTabPressed && event && !(KeyHelper.is('shift', event)) && !(KeyHelper.is('tab', event))|| this.isDaySelected) {
      this.day.nativeElement.value = '';
    }
    this.isTabPressed = KeyHelper.is('tab', event);
    this.isDaySelected = false;
    const inputNum = KeyHelper.getNumberFromKey(event);
    const possibleNum =
      this.getPossibleNum(this.day.nativeElement, event);
    const maxDate = this.getMaxDate();
    const numJumpThreshold =
      this.getNumJumpThreshold(this.month.nativeElement.value);

    if (possibleNum > maxDate
      || !this.keys.isAllowed(event)) {
      event.preventDefault();
      return;
    }
    let dupModel;
    if (inputNum !== undefined) {
      if (event.target.value.length === 1 ||
        (event.target.value.length === 0
          && possibleNum > numJumpThreshold)) {
        this.year.nativeElement.focus();
      }
      this.day.nativeElement.value = possibleNum;
      dupModel = this.inputModel;
      event.preventDefault();
    }
    this.onChangeHandler(dupModel);
  }

  getMaxDate(): number {
    const februaryLeap = 29;
    const february = 28;
    const thirty = 30;
    let maxDate = 31;

    const month = parseInt(
      this.month.nativeElement.value,
      undefined
    );

    if (this.thirtyDayMonths.indexOf(month) !== -1) {
      maxDate = thirty;
    }

    if (month === 2) {
      maxDate = februaryLeap;
      if (this.year.nativeElement.value
        && !this._isLeapYear(this.year.nativeElement.value)) {
        maxDate = february;
      }
    }
    return maxDate;
  }

  getNumJumpThreshold(month) {
    const three = 3; // What is numJumpThreshold and what is this const?
    return month === 2 ? 2 : three;
  }

  onYearBlur(event) {
    this.isYearBlur = true;
    if (this.year.nativeElement.value === '0') {
      this.year.nativeElement.value = '';
    }
    if (this.year.nativeElement.value
      && !this._isLeapYear(this.year.nativeElement.value)
      && this.month.nativeElement.value === '2'
      && this.day.nativeElement.value === '29') {
      this.day.nativeElement.value = '';
    }
  }

  onYearInput(event) {
    const key = KeyHelper.getKeyCode(event);
    const maxValue = 9999;
    let dupModel;
    if (this._checkCopyPasteChar(key)) {
      return;
    }
    if (this.isTabPressed && event && !(KeyHelper.is('shift', event)) && !(KeyHelper.is('tab', event)) || this.isYearSelected) {
      this.year.nativeElement.value = '';
    }
    this.isTabPressed = KeyHelper.is('tab', event);
    this.isYearSelected = false;
    const inputNum = KeyHelper.getNumberFromKey(event);
    const possibleNum =
      this.getPossibleNum(this.year.nativeElement, event);

    if (possibleNum > maxValue
      || !this.keys.isAllowed(event)) {
      event.preventDefault();
      return;
    }
    if (inputNum !== undefined) {
      const three = 3;
      if (event.target.value.length === three) {
        this.blurEvent.emit('year entered');
        this.blur.emit();
      }
      this.year.nativeElement.value = possibleNum;
      dupModel = this.inputModel;
      event.preventDefault();
    }
    this.onChangeHandler(dupModel);
  }

  removalKeyHandler() {
    const dupModel = this.inputModel;
    this.onChangeHandler(dupModel);
  }

  onChangeHandler(override = undefined) {
    this.onTouched();
    let dayCheck = this.isDateTouched || (!this.isDateTouched && this.day.nativeElement.value);
    let monthCheck = this.isMonthTouched || (!this.isMonthTouched && this.month.nativeElement.value);
    let yearCheck = this.isYearTouched || (!this.isYearTouched && this.year.nativeElement.value);
    if (dayCheck && monthCheck && yearCheck && !this.isTabPressed) {
      if (this.isEmptyField(override)) {
        this.onChange(null);
        this.valueChange.emit(null);
      } else if (this.isYearTouched) {
        if (this.year.nativeElement.value.length != 4) {
          this.onChange('Invalid Date');
          this.valueChange.emit('Invalid Date');
        } else {
          const dateString = this.getDate(override).format(this.OUTPUT_FORMAT);
          this.onChange(dateString);
          this.valueChange.emit(dateString);
        }
      } else if ((!this.getDate(override).isValid())) {
        this.onChange('Invalid Date');
        this.valueChange.emit('Invalid Date');
      } else {
        // use the strict format for outputs
        const dateString = this.getDate(override).format(this.OUTPUT_FORMAT);
        this.onChange(dateString);
        this.valueChange.emit(dateString);
      }
    }
    this.focusHandler();
  }

  focusHandler() {
    if (this.isDateTouched || this.isMonthTouched || this.isYearTouched) {
      this.focus.emit(true);
    }
  }
  dateBlurred() {
    if (this.isDateTouched && this.isMonthTouched && this.isYearTouched && this.isMonthBlur && this.isDayBlur && this.isYearBlur) {
      this.blurEvent.emit(true);
      this.blur.emit(true);
    }
  }

  touchHandler() {
    if (this.isDateTouched && this.isMonthTouched && this.isYearTouched) {
      const dupModel = this.inputModel;
      this.onChangeHandler(dupModel);
    }
  }
  isEmptyField(override = undefined) {
    let dupModel = this.inputModel;
    if (override) {
      dupModel = override;
    }
    return (isNaN(dupModel.day)
      || dupModel.day === undefined
      || dupModel.day === '')
      && (isNaN(dupModel.month)
        || dupModel.month === undefined
        || dupModel.month === '')
      && (isNaN(dupModel.year)
        || dupModel.year === undefined
        || dupModel.year === '');
  }

  isValid() {
    const dupModel = this.inputModel;
    return this.getDate(dupModel).isValid();
  }

  monthName() {
   return (this.required ? `${this.name} month required.` : `${this.name} month`) + ' Enter Month Here';
  }

  dayName() {
    return (this.required ? `${this.name} day required.` : `${this.name} day`) + ' Enter Day Here';
  }

  yearName() {
    return (this.required ? `${this.name} year required.` : `${this.name} year`) + ' Enter Year Here';
  }

  triggerTouch(ev) {
    this.isYearTouched = true;
    this.touchHandler()
    this.onTouched();
  }

  onMonthSelected() {
    this.isMonthSelected = true;
  }

  onDaySelected() {
    this.isDaySelected = true;
  }

  onYearSelected() {
    this.isYearSelected = true;
  }

  triggerMonthTouch(event) {
    this.isMonthTouched = true;
    if (event.target.value.substring(0, 1) === '0') {
      this.month.nativeElement.value = event.target.value.substring(1);
    }
    this.touchHandler()
    this.onTouched();
  }
  triggerDayTouch(event) {
    this.isDateTouched = true;
    if (event.target.value.substring(0, 1) === '0') {
      this.day.nativeElement.value = event.target.value.substring(1);
    }
    this.touchHandler()
    this.onTouched();
  }

  resetInput() {
    this.day.nativeElement.value = '';
    this.month.nativeElement.value = '';
    this.year.nativeElement.value = '';
  }

  _checkCopyPasteChar(char) {
    if (char === 'c' || char === 'v') {
      return true;
    }
  }

  _keyIsNumber(char) {
    // tslint:disable-next-line
    if (char.match(/[0-9]/) != undefined) {
      return true;
    }
  }

  _getClipboardText(event) {
    // It is problematic to reference DOM elements in Angular components
    // We should revisit that practice through our entire code base
    const win: any = window;
    if (event.clipboardData && event.clipboardData.getData('text')) {
      return event.clipboardData.getData('text');
    } else if (win.clipboardData
      && win.clipboardData.getData('text')) {
      return win.clipboardData.getData('text');
    }
  }

  _shouldClearDayInput(num) {
    if ((this.thirtyDayMonths.indexOf(parseInt(num, undefined)) !== -1
      && this.day.nativeElement.value === '31')
      || (num === '2'
        && this.nonFebruaryDays.indexOf(
          parseInt(this.day.nativeElement.value, undefined)
        ) !== -1)) {
      return true;
    }
  }

  _isLeapYear(year) {
    const quadrennial = 4;
    const centennial = 100;
    const quadricentennial = 400;
    return ((year % quadrennial === 0)
      && (year % centennial !== 0))
      || (year % quadricentennial === 0);
  }

  // controlvalueaccessor methods
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
      this.parseValueString();
    } else {
      this.resetInput();
      this.value = '';
      this.parseValueString();
    }
  }
}
