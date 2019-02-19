import {
  Component,
  OnInit, Input, Output, EventEmitter, forwardRef, ViewChild
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';
import { FieldsetWrapper } from '../../../ui-kit/wrappers/fieldset-wrapper';


export interface DateModel {
  startDate: string,
  endDate: string
};
export interface DateConfig {
  name: string,
  placeholder: string,
  label: string,
  hint: string,
  rangeStart: Date,
  rangeEnd: Date,
  showCalendar: boolean,
  weekStart: number,
  dateFormat: string,
  disabled: boolean
}

export interface DateRangeSettings {
  label: string,
  hint: string,
  cancelText: string,
  errorMessage: string,
  required:string
}

@Component({
  selector: 'sam-date-range-v2',
  templateUrl: './date-range-v2.component.html',
  styleUrls: ['./date-range-v2.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamDateRangeV2Component),
    multi: true
  }]
})
export class SamDateRangeV2Component implements OnInit, ControlValueAccessor {

 /**
  * Date Range settings
  */
  @Input() dateRangeConfig: DateRangeSettings;

  /**
  * Deprecated, Sets the bound value of the component
  */
  @Input() model: DateModel = {
    startDate: '',
    endDate: ''
  };

  /**
  * Start date configurations
  */
  @Input() startDateConfig: DateConfig;

  /**
  * End date configurations
  */
  @Input() endDateConfig: DateConfig;
  /**
   * Sets the angular FormControl
   */

  /**
  * Sets the angular FormControl
  */
  @Input() control: FormControl;

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  private disabled: boolean;

  get value() {
    return this.model;
  }
  set value(val) {
    this.setSelectedDate(val);
    this.onChange(this.model);
    this.onTouched();
  }
  onChange: any = (c) => undefined;
  onTouched: any = () => undefined;

  ngOnInit() {
    if (this.control) {
      this.control.valueChanges.subscribe(() => {
        this.wrapper.formatErrors(this.control);
      });
      this.wrapper.formatErrors(this.control);
    }
  }

  onDateChange() {
    this.onChange(this.model);
  }

  setSelectedDate(val: any) {
    this.model.startDate = val.startDate;
    this.model.endDate = val.endDate;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    let returnValue = value;
    if (!returnValue) {
      returnValue = {};
    }
    this.setSelectedDate(returnValue);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
