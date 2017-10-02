import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn, AbstractControl} from "@angular/forms";
import { SamDateComponent } from "../date/date.component";
import { SamDateTimeComponent } from "../date-time/date-time.component";
import {SamFormService} from '../../form-service';

//to do: move these to appropriate locations after validations are figured out for the ui-kit
function dateRangeValidation(c:AbstractControl){
  if(c.value && c.value.startDate && c.value.endDate){
    let startDateM = moment(c.value.startDate);
    let endDateM = moment(c.value.endDate);
    if(startDateM.get('year')>1000 && endDateM.get('year')>1000 && endDateM.diff(startDateM) < 0){
      return {
        dateRangeError: {
          message: "Invalid date range"
        }
      }
    }
  }
  if (c.value && c.value.startDate){
    let startDateM = moment(c.value.startDate);
    if(!startDateM.isValid() || c.value.startDate=="Invalid date"){
      return {
        dateRangeError: {
          message: "Invalid From Date"
        }
      }
    }
  }
  if (c.value && c.value.endDate){
    let endDateM = moment(c.value.endDate);
    if(!endDateM.isValid() || c.value.endDate=="Invalid date"){
      return {
        dateRangeError: {
          message: "Invalid To Date"
        }
      }
    }
  }
  return null;
}
function dateRangeRequired(c:AbstractControl){
  if(c.dirty && (!c.value || (!c.value.startDate && !c.value.endDate))){
    return {
      dateRangeError: {
        message: "This field is required"
      }
    };
  }
}

/**
 * The <sam-date> component is a Date entry portion of a form
 */
@Component({
  selector: 'sam-date-range',
  templateUrl: 'date-range.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamDateRangeComponent),
    multi: true
  }]
})
export class SamDateRangeComponent implements OnInit, OnChanges, ControlValueAccessor {
  public INPUT_FORMAT: string = 'Y-M-D';
  public OUTPUT_FORMAT: string = 'YYYY-MM-DD';
  public DT_INPUT_FORMAT: string = 'Y-M-DTH:m';
  public T_OUTPUT_FORMAT: string = "HH:mm";

  startModel: any = {
    month: null,
    day: null,
    year: null
  };
  endModel: any = {
    month: null,
    day: null,
    year: null
  }

  /**
  * Sets the label text
  */
  @Input() stacked: boolean = false;
  /**
  * Sets the label text
  */
  @Input() label: string = "";
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string = "";
  /**
  * Sets the required text
  */
  @Input() required: string = "";
  /**
  * Sets the disabled status of component, defaults to false
  */
  @Input() disabled: boolean = false;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles date-time mode
  */
  @Input() type: string = "date";
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Toggles default component validations
  */
  @Input() defaultValidations: boolean = true;
  /**
  * Event emitted when value changes
  */
  @Output() valueChange = new EventEmitter<any>();

  onChange: any = () => {};
  onTouched: any = () => {};

  @ViewChild('startControl') startControl;
  @ViewChild('endControl') endControl;
  @ViewChild('startDate') startDateComp;
  @ViewChild('endDate') endDateComp;
  private startDateValue;
  private endDateValue;
  @ViewChild('wrapper') wrapper;

  constructor(private samFormService:SamFormService) { }

  ngOnInit() {
    if(!this.control){
      return;
    }
    let validators: ValidatorFn[] = [];
    if(this.control.validator){
      validators.push(this.control.validator);
    }
    if(this.defaultValidations){
      if(this.required){
        validators.push(dateRangeRequired);
      }
      validators.push(dateRangeValidation);
    }
    this.control.setValidators(validators);
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

  ngOnChanges() {
    this.parseValueString();
  }

  focusHandler(){
    this.onTouched();
  }

  parseValueString() {
    let format = this.type!="date-time"? this.INPUT_FORMAT : this.DT_INPUT_FORMAT;
    if (this.startDateValue) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.startDateValue, format);
      this.startModel.month = m.month() + 1;
      this.startModel.day = m.date();
      this.startModel.year = m.year();
      if(this.type=="date-time"){
        this.startModel.time = m.format(this.T_OUTPUT_FORMAT);
      }
    }
    else{
      this.startModel.month = "";
      this.startModel.day = "";
      this.startModel.year = "";
    }
    if (this.endDateValue) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.endDateValue, format);
      this.endModel.month = m.month() + 1;
      this.endModel.day = m.date();
      this.endModel.year = m.year();
      if(this.type=="date-time"){
        this.endModel.time = m.format(this.T_OUTPUT_FORMAT);
      }
    }
    else{
      this.endModel.month = "";
      this.endModel.day = "";
      this.endModel.year = "";
    }
  }

  getDate(model) {
    return moment([model.year, model.month-1, model.day]);
  }

  startDateChange(evt){
    this.startDateValue = evt;
    this.parseValueString();
    this.dateChange();
  }

  endDateChange(evt){
    this.endDateValue = evt;
    this.parseValueString();
    this.dateChange();
  }

  dateChange(){
    let startDateString = ""; 
    let endDateString = ""; 
    if(!this.isClean(this.startModel)){
      startDateString = this.getDate(this.startModel).format(this.OUTPUT_FORMAT);
    }
    if(!this.isClean(this.endModel)){
      endDateString = this.getDate(this.endModel).format(this.OUTPUT_FORMAT);
    }
    let output = {
        startDate: startDateString,
        endDate: endDateString
    };
    if(this.type=="date-time"){
      let startTimeString = this.startModel.time;
      let endTimeString = this.endModel.time;
      output['startTime'] = startTimeString;
      output['endTime'] = endTimeString;
    }
    this.onChange(output);
    this.valueChange.emit(output);
  }

  isClean(model) {
    return (model.day===""|| model.day===null) &&
      (model.month==="" || model.month===null) &&
      (model.year==="" || model.year===null);
  }

  dateBlur(){
    if(this.type=="date"){
      this.endDateComp.month.nativeElement.focus();
    }
  }

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
    if(value && typeof value == "object" && (value['startDate'] || value['endDate'])){
      this.startDateValue = value.startDate;
      this.endDateValue = value.endDate;
      this.parseValueString();
    }
    else{
      this.startDateValue = "";
      this.endDateValue = "";
      this.parseValueString();
    }
  }
}
