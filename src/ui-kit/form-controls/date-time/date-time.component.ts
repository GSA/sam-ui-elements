import { Component, Input, ViewChild, Output, EventEmitter, OnInit, forwardRef, OnChanges } from '@angular/core';
import * as moment from 'moment/moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { SamDateComponent } from '../date/date.component';
import { SamTimeComponent } from '../time/time.component';


const MY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamDateTimeComponent),
  multi: true
};

/**
 * The <samDateTime> component is a DateTime entry portion of a form
 */
@Component({
  selector: 'samDateTime',
  templateUrl: 'date-time.template.html',
  providers: [ MY_VALUE_ACCESSOR ]
})
export class SamDateTimeComponent implements OnInit, OnChanges, ControlValueAccessor {
  public INPUT_FORMAT: string = 'Y-M-DTH:m';

  @Input() value: string = null;
  /**
   * Event emitted when value is changed
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  /**
   * Sets starting value for input
   */
  @Input() label: string;
  /**
   * Sets name attribute value
   */
  @Input() name: string;
  /**
   * Sets error message string to display for invalid values
   */
  @Input() errorMessage: string;
  /**
   * Sets disabled attribute value for input
   */
  @Input() disabled: boolean = false;  
  /**
   * Something to do with formbuilder? This needs to be document and annotated
   */
  @Input() control;

  public time: string = null;
  public date: string = null;

  @ViewChild('dateComponent') dateComponent: SamDateComponent;
  @ViewChild('timeComponent') timeComponent: SamTimeComponent;
  @ViewChild(FieldsetWrapper) wrapper;

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamDateTimeComponent requires a [name] input for 508 compliance');
    }

    if (this.control) {
      this.wrapper.formatErrors(this.control);
    }
  }

  ngOnChanges() {
    this.parseValueString();
  }

  parseValueString(): void {
    if (this.value) {
      // use the more forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.value, this.INPUT_FORMAT);
      if (m.isValid()) {
        this.time = m.format(this.timeComponent.OUTPUT_FORMAT);
        this.date = m.format(this.dateComponent.OUTPUT_FORMAT);
      } else {
        console.error('[value] for samDateTime is invalid');
      }
    }
  }

  emitChanges(val: string): void {
    this.value = val;
    // only when this component is used as a FormControl will change be registered
    if (this.onChange) {
      this.onChange(val);
    }
    this.valueChange.emit(val);
  }

  onInputChange(): void {
    if (this.dateComponent.isClean() && this.timeComponent.isClean()) {
      this.emitChanges(null);
    } else if (this.dateComponent.isValid() && this.timeComponent.isValid()) {
      this.emitChanges(`${this.date}T${this.time}`);
    } else {
      this.emitChanges('Invalid Date Time');
    }
  }

  onChange: Function;
  onTouched: Function;

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
