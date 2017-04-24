import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";

/**
 * The <samDate> component is a Date entry portion of a form
 */
@Component({
  selector: 'samDate',
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

  constructor() { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamTimeComponent required a name for 508 compliance');
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
  }

  onBlur() {
     this.blurEvent.emit();
  }

  getDate() {
    return moment([this.model.year, this.model.month-1, this.model.day]);
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
    }
  }
}
