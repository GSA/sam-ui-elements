import {
  Component,
  OnInit, Input, Output, EventEmitter, forwardRef, ViewChild
} from '@angular/core';

import {
 ControlValueAccessor,
 NG_VALUE_ACCESSOR,
 FormControl,
} from '@angular/forms';
import { LabelWrapper } from '../../../ui-kit/wrappers/label-wrapper';

export interface DateConfig {
  name: string,
  placeholder: string,
  label: string,
  hint: string,
  date: any
}
export interface SelectedModel {
  startDate: any,
  endDate: any
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

 @Input() dateRangeConfig: any = {};

  /**
* Deprecated, Sets the bound value of the component
*/
  @Input() model: any = {};

  @Input() startDateConfig: DateConfig;

  @Input() endDateConfig: DateConfig;
 /**
  * Sets the angular FormControl
  */
 @Input() control: FormControl;
 
 @ViewChild(LabelWrapper) public wrapper: LabelWrapper;
 
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
