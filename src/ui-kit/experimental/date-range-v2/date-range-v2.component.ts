import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

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
  styleUrls: ['./date-range-v2.component.scss']
})
export class SamDateRangeV2Component {

  public selectedModel: any = {};

  @Input() startDateConfig: DateConfig;

  @Input() endDateConfig: DateConfig;

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectedDates = new EventEmitter<SelectedModel>();

  startDateChange(newStartDate) {
    this.selectedModel.startDate = newStartDate;
    this.selectedDates.emit(this.selectedModel);
  }

  endDateChange(newEndDate) {
    this.selectedModel.endDate = newEndDate;
    this.selectedDates.emit(this.selectedModel);
  }
}
