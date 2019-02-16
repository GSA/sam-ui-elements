import {
  Component,
  OnInit, Input, Output, EventEmitter, forwardRef
} from '@angular/core';

import {
 ControlValueAccessor,
 NG_VALUE_ACCESSOR,
 FormControl,
} from '@angular/forms';

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

  /**
* Deprecated, Sets the bound value of the component
*/
@Input() model: any = {};

  public selectedModel: any = {};

  @Input() startDateConfig: DateConfig;

  @Input() endDateConfig: DateConfig;
 /**
  * Sets the angular FormControl
  */
 @Input() control: FormControl;
 
  /**
  * Deprecated, Event emitted when the model value changes
  */
 @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

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
    this.selectedModel.startDate = this.model.startDate;
    this.selectedModel.endDate = this.model.endDate;
  }

  emit() {
    this.selectedModel = this.model;
    this.modelChange.emit(this.model);
  }

  startDateChange(newStartDate) {
    this.model.startDate = newStartDate;
   this.emit()
  }

  endDateChange(newEndDate) {
    this.model.endDate = newEndDate;
    this.emit()
  }

  setSelectedDate(val: any) {
    this.model.startDate = val.startDate;
    this.model.endDate = val.endDate;
    this.selectedModel = this.model;
   this.emit()
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
}
