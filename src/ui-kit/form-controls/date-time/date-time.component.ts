import { Component, Input, ViewChild, Output, EventEmitter, OnInit, forwardRef, OnChanges } from '@angular/core';
import * as moment from 'moment/moment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { SamDateComponent } from '../date/date.component';
import { SamTimeComponent } from '../time/time.component';
import {SamFormService} from '../../form-service';

const MY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamDateTimeComponent),
  multi: true
};

/**
 * The <sam-date-time> component is a DateTime entry portion of a form
 */
@Component({
  selector: 'sam-date-time',
  templateUrl: 'date-time.template.html',
  providers: [ MY_VALUE_ACCESSOR ]
})
export class SamDateTimeComponent implements OnInit, OnChanges, ControlValueAccessor {
  public INPUT_FORMAT: string = 'Y-M-DTH:m';
  /**
   * Sets starting value for input
   */
  @Input() label: string;
  /**
   * Sets name attribute value
   */
  @Input() name: string;
  /**
   * Sets hint text
   */
  @Input() hint: string;
  /**
   * Sets error message string to display for invalid values
   */
  @Input() errorMessage: string;
  /**
   * Sets disabled attribute value for input
   */
  @Input() disabled: boolean = false;  
  /**
   * Sets the formControl to check validations and update error messaged
   */
  @Input() control;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  value;
  public time: string = null;
  public date: string = null;

  @ViewChild('dateComponent') dateComponent: SamDateComponent;
  @ViewChild('timeComponent') timeComponent: SamTimeComponent;
  @ViewChild(FieldsetWrapper) wrapper;

  constructor(private samFormService:SamFormService) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamDateTimeComponent requires a [name] input for 508 compliance');
    }

    if (this.control) {
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

  parseValueString(): void {
    if (this.value) {
      // use the more forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.value, this.INPUT_FORMAT);
      if (m.isValid()) {
        this.time = m.format(this.timeComponent.OUTPUT_FORMAT);
        this.date = m.format(this.dateComponent.OUTPUT_FORMAT);
      } else {
        console.error('[value] for sam-date-time is invalid');
      }
    }
  }

  emitChanges(val: string): void {
    this.value = val;
    // only when this component is used as a FormControl will change be registered
    if (this.onChange) {
      this.onChange(val);
    }
  }

  dateBlur(){
    this.timeComponent.hour_v.nativeElement.focus();
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
