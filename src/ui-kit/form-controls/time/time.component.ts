import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  forwardRef
} from '@angular/core';
import * as moment from 'moment/moment';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import {SamFormService} from '../../form-service';

/**
 * Provides a time input form control
 */
@Component({
  selector: 'sam-time',
  templateUrl: 'time.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamTimeComponent),
    multi: true
  }]
})
export class SamTimeComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  INPUT_FORMAT: string = 'H:m';
  OUTPUT_FORMAT: string = 'HH:mm';
  
  /**
  * Sets the required text
  */
  @Input() public required: boolean = false;
  /**
  * Sets the disabled attribute
  */
  @Input() public disabled: boolean = false;
  /**
  * Sets the label
  */
  @Input() public label: string;
  /**
  * Sets the name attribute 
  */
  @Input() public name: string;
  /**
  * Sets the hint text
  */
  @Input() public hint: string;
  /**
  * Passes in the Angular FormControl
  */
  @Input() public control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() public useFormService: boolean;

  @ViewChild(LabelWrapper, {static: true}) public wrapper: LabelWrapper;
  @ViewChild('hour', {static: true}) public hourV;
  @ViewChild('minute', {static: true}) public minuteV;
  @ViewChild('ampm', {static: true}) public ampmV;

  public value: string = undefined;
  public hours: number = undefined;
  public formattedHours: string = undefined;
  public minutes: number = undefined;
  public amPm: string = 'am';
  public minuteBlurFlag = true;
  public allowChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  constructor(private samFormService: SamFormService) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamTimeComponent required a [name] for 508 compliance');
    }
    if (this.control) {
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

  ngOnChanges(v) {
    if (v.value) {
      this.parseValueString();
    }
  }

  parseValueString() {
    const m = moment(this.value, this.INPUT_FORMAT);

    if (!m.isValid()) {
      return;
    }

    let hours = m.hours();
    const minutes = m.minutes();

    // convert from 24 hour to 12 hour time

    if (hours > 12) {
      this.amPm = 'pm';
      hours -= 12;
    } else {
      this.amPm = 'am';
    }

    if (hours === 0) {
      hours = 12;
    }

    this.hours = hours;
    this.minutes = minutes;
  }

  formatHours(hours) {
    let hoursInt = parseInt(hours, undefined);
    if (hoursInt === 12) {
      hoursInt = 0;
    }
    if (this.amPm === 'pm') {
      return hoursInt + 12;
    } else {
      return hoursInt;
    }
  }

  selectChange() {
    // this.parseValueString();
    const m = moment({
      hour: this.formatHours(this.hourV.nativeElement.value), 
      minute: this.minuteV.nativeElement.value
    }).format(this.OUTPUT_FORMAT);
    this.onInputChange(m);
  }

  onInputChange(override) {
    let returnVal = override;
    if (!returnVal) {
      returnVal = 'Invalid Time';
    } 
    this.onChange(returnVal);
  }
  
  hourTouched(event) {
    if (event.srcElement.value.substring(0, 1) === '0') {
      this.hourV.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.setTouched();
  }

  minuteTouched(event) {
    if (event.srcElement.value.substring(0, 1) === '0') {
      this.minuteV.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.setTouched();
  }

  setTouched() {
    this.onTouched();
  }

  isValid() {
    const hours = parseInt(this.hourV.nativeElement.value, 10);
    const minutes = parseInt(this.minuteV.nativeElement.value, 10);
    return !isNaN(hours) && !isNaN(minutes)
        && typeof hours === 'number' && typeof minutes === 'number'
        && hours >= 1 && hours <= 12
        && minutes >= 0 && minutes <= 59;
  }

  getTime(): any {
    if (!this.isValid()) {
      return undefined;
    }

    // convert from 12 hour to 24 hour times

    let hours = this.hourV.nativeElement.value;

    if (hours === 12) {
      hours = 0;
    }

    if (this.amPm === 'pm') {
      hours += 12;
    }

    return moment({
      hour: hours, 
      minute: this.minuteV.nativeElement.value
    });
  }

  // used by date-time/date-range comps
  isEmptyField() {
    const hours = this.hours;
    const minutes = this.minutes;
    return (isNaN(hours) || hours === undefined)
      && (isNaN(minutes) || this.minutes === undefined);
  }
  
  hoursPress(event) {
    if (this._checkCopyPasteChar(event.key)) {
      return;
    }
    const inputNum = parseInt(event.key, 10);
    let possibleNum;
    if (!isNaN(this.hourV.nativeElement.value) 
      && this.hourV.nativeElement.value !== '') {
      possibleNum = (parseInt(this.hourV.nativeElement.value, 10) * 10)
        + inputNum;
    } else {
      possibleNum = inputNum;
    }
    if (possibleNum > 12 || this.allowChars.indexOf(event.key) === -1) {
      event.preventDefault();
      return;
    }
    if (this._keyIsNumber(event.key)) {
      if (event.target.value.length === 1 || 
        (event.target.value.length === 0 && possibleNum > 1)) {
        this.minuteV.nativeElement.focus();
      }
      this.hourV.nativeElement.value = possibleNum;
      const val = moment({
        hour: this.formatHours(possibleNum), 
        minute: this.minuteV.nativeElement.value
      }).format(this.OUTPUT_FORMAT);
      this.onInputChange(val);
      event.preventDefault();
    }
  }

  minutesPress(event) {
    if (this._checkCopyPasteChar(event.key)) {
      return;
    }
    const inputNum = parseInt(event.key, 10);
    let possibleNum;
    if (!isNaN(parseInt(this.minuteV.nativeElement.value, 10)) 
      && this.minuteV.nativeElement.value !== '') { 
      possibleNum = (parseInt(this.minuteV.nativeElement.value, 10) * 10)
        + inputNum;
    } else {
      possibleNum = inputNum;
    }
    if (possibleNum > 59 || this.allowChars.indexOf(event.key) === -1) {
      event.preventDefault();
      return;
    }
    if (this._keyIsNumber(event.key)) {
      if (event.target.value.length === 1 || 
        (event.target.value.length === 0 && possibleNum > 5)) {
        this.ampmV.nativeElement.focus();
      }
      this.minuteV.nativeElement.value = possibleNum;
      const val = moment({
        hour: this.formatHours(this.hourV.nativeElement.value), 
        minute: possibleNum
      }).format(this.OUTPUT_FORMAT);
      this.onInputChange(val);
      event.preventDefault();
    }
  }

  hourName() {
    return `${this.name}_hour`;
  }

  minuteName() {
    return `${this.name}_minute`;
  }

  amPmName() {
    return `${this.name}_am_pm`;
  }

  _keyIsNumber(char) {
    if (char.match(/[0-9]/) !== null) {
      return true;
    }
  }

  _checkCopyPasteChar(char) {
    if (char === 'c' || char === 'v') {
      return true;
    }
  }

  removalKeyHandler() {
    const m = moment({
      hour: this.formatHours(this.hourV.nativeElement.value), 
      minute: this.minuteV.nativeElement.value
    }).format(this.OUTPUT_FORMAT);
    this.onChange(m);
  }

  resetInput() {
    // this.hours = '';
    // this.minutes = '';
    this.hourV.nativeElement.value = '';
    this.minuteV.nativeElement.value = '';
    this.ampmV.nativeElement.value = 'am';
  }

  onChange: any = () => undefined;
  onTouched: any = () => undefined;
  
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
    } else {
      this.value = '';
      this.resetInput();
    }
    this.parseValueString();
  }
}
