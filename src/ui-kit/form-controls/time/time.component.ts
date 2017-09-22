import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef } from '@angular/core';
import * as moment from 'moment/moment';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn } from "@angular/forms";
import {SamFormService} from '../../form-service';

/**
 * The <sam-time> component provides a time input form control
 *
 * @Input value: string - Sets the time value 
 * @Input disabled: boolean - Sets the disabled attribute
 * @Input name: string - Sets the name attribute 
 * @Output valueChange: boolean - Emits event when value change
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
export class SamTimeComponent implements OnInit, OnChanges, ControlValueAccessor {
  INPUT_FORMAT: string = "H:m";
  OUTPUT_FORMAT: string = "HH:mm";
  
  /**
  * Sets the time value 
  */
  @Input() value: string = null; // must be a 24 hour time and have the format HH:mm
  /**
  * Sets the disabled attribute
  */
  @Input() disabled: boolean = false;
  /**
  * Sets the name attribute 
  */
  @Input() name: string;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Emits event when value change
  */
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(LabelWrapper) wrapper: LabelWrapper;
  @ViewChild('hour') hour_v;
  @ViewChild('minute') minute_v;
  @ViewChild('ampm') ampm_v;
  hours: number = null;
  minutes: number = null;
  amPm: string = 'am';

  constructor(private samFormService:SamFormService) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamTimeComponent required a [name] for 508 compliance');
    }
    if(this.control){
      if(!this.useFormService){
        this.control.statusChanges.subscribe(()=>{
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
      }
      else {
        this.samFormService.formEventsUpdated$.subscribe(evt=>{
          if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='submit'){
            this.wrapper.formatErrors(this.control);
          } else if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='reset'){
            this.wrapper.clearError();
          }
        });
      }
    }
  }

  ngOnChanges(v) {
    this.parseValueString();
  }

  parseValueString() {
    let m = moment(this.value, this.INPUT_FORMAT);

    if (!m.isValid()) {
      return;
    }

    let hours = m.hours();
    let minutes = m.minutes();

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

  onInputChange() {
    this.onChange(this.toString());
    this.valueChange.emit(this.toString());
  }
  
  hourTouched(event){
    if(event.srcElement.value.substring(0,1) === "0"){
      this.hour_v.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.setTouched();
  }

  minuteTouched(event){
    if(event.srcElement.value.substring(0,1) === "0"){
      this.minute_v.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.setTouched();
  }

  setTouched(){
    this.onTouched();
  }

  isValid() {
    return !isNaN(this.hours) && !isNaN(this.minutes)
        && typeof this.hours === 'number' && typeof this.minutes === 'number'
        && this.hours >= 1 && this.hours <= 12
        && this.minutes >= 0 && this.minutes <= 59;
  }

  getTime(): any {
    if (!this.isValid()) {
      return null;
    }

    // convert from 12 hour to 24 hour times

    let hours = this.hours;

    if (hours === 12) {
      hours = 0;
    }

    if (this.amPm === 'pm') {
      hours += 12;
    }

    return moment({hour: hours, minute: this.minutes});
  }

  isClean() {
    return (isNaN(this.hours) || this.hours===null) && (isNaN(this.minutes) || this.minutes===null);
  }

  toString() {
    if (this.isClean()) {
      return null;
    } else if (!this.isValid()) {
      return 'Invalid Time';
    } else {
      return this.getTime().format(this.OUTPUT_FORMAT);
    }
  }
  
  hoursPress(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum = (this.hour_v.nativeElement.valueAsNumber * 10) + inputNum;
    if(possibleNum > 12 || event.key === "-"){
      event.preventDefault();
      return;
    }
    if(event.target.value.length+1==2 && event.key.match(/[0-9]/)!=null){
      this.minute_v.nativeElement.focus();
    }
  }

  hoursBlur(event, override){
    var eventElemVal = override ? override : event.srcElement.value;
    var leadingZero = eventElemVal[0] === "0"
    if(parseInt(eventElemVal, 10) < 10 && !leadingZero){
      this.hour_v.nativeElement.value = "0" + eventElemVal;
    }
  }

  minutesPress(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum = (this.minute_v.nativeElement.valueAsNumber * 10) + inputNum;
    if(possibleNum > 59 || event.key === "-"){
      event.preventDefault();
      return;
    }
    if(event.target.value.length+1==2 && event.key.match(/[0-9]/)!=null){
      this.minutes = possibleNum;
      this.minutesBlur(event, possibleNum);
      this.ampm_v.nativeElement.focus();
    }
  }

  minutesBlur(event, override){
    var eventElemVal = override ? override : event.srcElement.value;
    var leadingZero = eventElemVal[0] === "0"
    if(parseInt(eventElemVal, 10) < 10 && !leadingZero){
      this.minute_v.nativeElement.value = "0" + eventElemVal;
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

  onChange: any = () => { };
  onTouched: any = () => { };
  
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
    this.value = value;
    this.parseValueString();
  }
}
