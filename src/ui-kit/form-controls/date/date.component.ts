import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";
import {SamFormService} from '../../form-service';

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
export class SamDateComponent implements OnInit, OnChanges, ControlValueAccessor {
  public INPUT_FORMAT: string = 'Y-M-D';
  public OUTPUT_FORMAT: string = 'YYYY-MM-DD';

  model: any = {
    month: null,
    day: null,
    year: null
  };
  /**
  * Sets the general error message for component
  */
  @Input() errorMessage: string = "";
  /**
  * Sets the name attribute for component
  */
  @Input() name: string = "";
  /**
  * Sets the label text
  */
  @Input() label: string = "";
  /**
  * Sets the required text
  */
  @Input() required: string = "";
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string = "";
  /**
  * Sets the disabled status of component, defaults to false
  */
  @Input() disabled: boolean = false;
  /**
  * Sets the current value of the form control
  */
  @Input() value: string;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Event emitted when value changes
  */
  @Output() valueChange = new EventEmitter<any>();
  /**
  * Event emitted when form control loses focus
  */
  @Output() blurEvent = new EventEmitter<any>();
  onChange: any = () => {
    //this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };
  @ViewChild('month') month;
  @ViewChild('day') day;
  @ViewChild('year') year;
  @ViewChild('wrapper') wrapper;

  constructor(private samFormService:SamFormService) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamTimeComponent required a name for 508 compliance');
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

  ngOnChanges() {
    this.parseValueString();
  }

  parseValueString() {
    if (this.value) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.value, this.INPUT_FORMAT);
      if (m.isValid()) {
        this.model.month = m.month() + 1;
        this.model.day = m.date();
        this.model.year = m.year();
      }
    }
    else{
      this.model.month = "";
      this.model.day = "";
      this.model.year = "";
    }
  }

  onBlur() {
     this.blurEvent.emit();
  }

  onMonthBlur(event){
    var eventElemVal = event.srcElement.value;
    var leadingZero = eventElemVal[0] === "0"
    if(parseInt(eventElemVal, 10) < 10 && !leadingZero){
      this.month.nativeElement.value = "0" + eventElemVal;
    }
  }

  onDayBlur(event){
    var eventElemVal = event.srcElement.value;
    var leadingZero = eventElemVal[0] === "0"
    if(parseInt(eventElemVal, 10) < 10 && !leadingZero){
      this.day.nativeElement.value = "0" + eventElemVal;
    }
  }

  getDate() {
    return moment([this.model.year, this.model.month-1, this.model.day]);
  }

  onMonthInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum = (this.month.nativeElement.valueAsNumber * 10) + inputNum;
    if(possibleNum > 12 || event.key === "-"){
      event.preventDefault();
    }
  }

  onDayInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum = (this.day.nativeElement.valueAsNumber * 10) + inputNum;
    if(possibleNum > 31 || event.key === "-"){
      event.preventDefault();
    }
  }

  onYearInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum = (this.year.nativeElement.valueAsNumber * 10) + inputNum;
    if(possibleNum > 9999 || event.key === "-"){
      event.preventDefault();
    }
  }

  onChangeHandler() {
    this.onTouched();
    if (this.isClean()) {
      this.onChange(null);
      this.valueChange.emit(null);
    } else if (!this.getDate().isValid()) {
      this.onChange('Invalid Date');
      this.valueChange.emit('Invalid Date');
    } else {
      // use the strict format for outputs
      let dateString = this.getDate().format(this.OUTPUT_FORMAT);
      this.onChange(dateString);
      this.valueChange.emit(dateString);
    }
  }

  isClean() {
    return (isNaN(this.model.day) || this.model.day===null) &&
      (isNaN(this.model.month) || this.model.month===null) &&
      (isNaN(this.model.year) || this.model.year===null);
  }

  isValid() {
    return this.getDate().isValid();
  }

  monthName() {
    return `${this.name}_month`;
  }

  dayName() {
    return `${this.name}_day`;
  }

  yearName() {
    return `${this.name}_year`;
  }

  triggerTouch(){
    this.onTouched();
  }

  triggerMonthTouch(event){
    if(event.srcElement.value.substring(0,1) === "0"){
      this.month.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.onTouched();
  }
  triggerDayTouch(event){
    if(event.srcElement.value.substring(0,1) === "0"){
      this.day.nativeElement.value = event.srcElement.value.substring(1);
    }
    this.onTouched();
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
    if(value){
      this.value = value;
      this.parseValueString();
    } else {
      this.value = "";
      this.parseValueString();
    }
  }
}
