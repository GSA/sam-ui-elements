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
  * Deprecated - Sets the time value 
  */
  @Input() value: string = null; // must be a 24 hour time and have the format HH:mm
  /**
  * Sets the required text
  */
  @Input() required: boolean = false;
  /**
  * Sets the disabled attribute
  */
  @Input() disabled: boolean = false;
  /**
  * Sets the label
  */
  @Input() label: string;
  /**
  * Sets the name attribute 
  */
  @Input() name: string;
  /**
  * Sets the hint text
  */
  @Input() hint: string;
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
  hours: string = null;
  formattedHours: string = null;
  minutes: string = null;
  amPm: string = 'am';
  minuteBlurFlag = true;

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
    if(v['value']){
      this.parseValueString();
    }
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

    this.hours = this._shouldPad(""+hours) ? "0"+hours: ""+hours;
    this.minutes = this._shouldPad(""+minutes) ? "0"+minutes: ""+minutes;
  }

  formatHours(hours){
    let hoursInt = parseInt(hours);
    if(hoursInt==12){
      hoursInt=0;
    }
    if(this.amPm=="pm"){
      return hoursInt+12;
    } else {
      return hoursInt;
    }
  }

  hourChange(evt){
    this.hours = evt;
    this.value = moment({hour: this.formatHours(this.hours), 
      minute: this.minute_v.nativeElement.valueAsNumber}).format(this.OUTPUT_FORMAT);
    this.onInputChange();
  }

  selectChange(){
    //this.parseValueString();
    this.value = moment({hour: this.formatHours(this.hours), 
      minute: this.minute_v.nativeElement.valueAsNumber}).format(this.OUTPUT_FORMAT);
    this.onInputChange();
  }

  onInputChange() { 
    this.onChange(this.value);
    this.valueChange.emit(this.value);
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
    let hours = parseInt(this.hours);
    let minutes = parseInt(this.minutes);
    return !isNaN(hours) && !isNaN(minutes)
        && typeof hours === 'number' && typeof minutes === 'number'
        && hours >= 1 && hours <= 12
        && minutes >= 0 && minutes <= 59;
  }

  getTime(): any {
    if (!this.isValid()) {
      return null;
    }

    // convert from 12 hour to 24 hour times

    let hours = this.hours;

    if (hours === "12") {
      hours = "00";
    }

    if (this.amPm === 'pm') {
      hours = ""+(parseInt(hours) + 12);
    }

    return moment({hour: parseInt(hours), minute: parseInt(this.minutes)});
  }

  _shouldPad(value){
    var leadingZero = value[0] === "0";
    if(parseInt(value, 10) < 10 && !leadingZero){
      return true;
    }
  }

  //used by date-time/date-range comps
  isClean() {
    let hours = parseInt(this.hours);
    let minutes = parseInt(this.minutes);
    return (isNaN(hours) || hours===null) && (isNaN(minutes) || this.minutes===null);
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
    var possibleNum;
    if(isNaN(this.minute_v.nativeElement.valueAsNumber) || !this.minute_v.nativeElement.valueAsNumber){ 
      possibleNum = inputNum;
    } else {
      possibleNum = (this.minute_v.nativeElement.valueAsNumber * 10) + inputNum;
    }
    if(possibleNum > 59 || event.key === "-" || event.key === "e"){
      event.preventDefault();
      return;
    }
    if(event.target.value.length+1==2 && event.key.match(/[0-9]/)!=null){
      this.minute_v.nativeElement.value = possibleNum;
      this.minuteBlurFlag = false;//do not trigger minutesBlur() after focus change to override it
      this.ampm_v.nativeElement.focus();
      this.minuteBlurFlag = true;
      this.minutesBlur(event, possibleNum);
    }
    this.value = moment({hour: this.formatHours(this.hours), minute: possibleNum}).format(this.OUTPUT_FORMAT);
    this.onInputChange();
  }

  minutesBlur(event, override){
    if(!this.minuteBlurFlag){
      return;
    }
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
    if(!value){
      return;
    }
    this.value = value;
    this.parseValueString();
  }
}
