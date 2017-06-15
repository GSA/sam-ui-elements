import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn, AbstractControl} from "@angular/forms";

//to do: move these to appropriate locations after validations are figured out for the ui-kit
function dateRangeValidation(c:AbstractControl){
  if(c.value && c.value.startDate && c.value.endDate){
    let startDateM = moment(c.value.startDate);
    let endDateM = moment(c.value.endDate);
    if(endDateM.diff(startDateM) < 0){
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
          message: "Invalid start date"
        }
      }
    }
  } 
  if (c.value && c.value.endDate){
    let endDateM = moment(c.value.endDate);
    if(!endDateM.isValid() || c.value.endDate=="Invalid date"){
      return {
        dateRangeError: {
          message: "Invalid end date"
        }
      }
    }
  }
  return null;
}
function dateRangeRequired(c:AbstractControl){
  if(!c.value || (!c.value.startDate && !c.value.endDate)){
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
  * Event emitted when value changes
  */
  @Output() valueChange = new EventEmitter<any>();

  onChange: any = () => {};
  onTouched: any = () => {};

  @ViewChild('startControl') startControl;
  @ViewChild('endControl') endControl;
  private startDateValue;
  private endDateValue;
  @ViewChild('wrapper') wrapper;

  constructor() { }

  ngOnInit() { 
    if(!this.control){
      return;
    }
    let validators: ValidatorFn[] = [];
    if(this.control.validator){
      validators.push(this.control.validator);
    }
    if(this.required){
      validators.push(dateRangeRequired);
    }
    validators.push(dateRangeValidation);
    this.control.setValidators(validators);
    this.control.valueChanges.subscribe(()=>{
      this.wrapper.formatErrors(this.control);
    });
    this.wrapper.formatErrors(this.control);
  }

  ngOnChanges() {
    this.parseValueString();
  }

  focusHandler(){
    this.onTouched();
  }

  parseValueString() {
    if (this.startDateValue) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.startDateValue, this.INPUT_FORMAT);
      this.startModel.month = m.month() + 1;
      this.startModel.day = m.date();
      this.startModel.year = m.year();
    }
    if (this.endDateValue) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.endDateValue, this.INPUT_FORMAT);
      this.endModel.month = m.month() + 1;
      this.endModel.day = m.date();
      this.endModel.year = m.year();
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
    let startDateString = this.getDate(this.startModel).format(this.OUTPUT_FORMAT);
    let endDateString = this.getDate(this.endModel).format(this.OUTPUT_FORMAT);
    let output = {
        startDate: startDateString,
        endDate: endDateString
    };
    this.onChange(output);
    this.valueChange.emit(output);
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
    if(value && typeof value == "object" && value['startDate'] && value['endDate']){
      this.startDateValue = value.startDate;
      this.endDateValue = value.endDate;
      this.parseValueString();
    }
  }
}
