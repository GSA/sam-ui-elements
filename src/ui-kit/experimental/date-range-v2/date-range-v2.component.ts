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
export class SamDateRangeV2Component implements OnInit{

  public selectedModel: any = {};

  @Input() startDateConfig: DateConfig;

  @Input() endDateConfig: DateConfig;

  ngOnInit(){
    this.selectedModel.startDate = this.startDateConfig.date;
    this.selectedModel.endDate = this.endDateConfig.date;
    this.emit()
  }

  emit(){
    this.selectedDates.emit(this.selectedModel);
  }
  /**
  * Event emitted when row set is selected.
  */
  @Output() selectedDates = new EventEmitter<SelectedModel>();

  startDateChange(newStartDate) {
    this.selectedModel.startDate = newStartDate;
    this.emit()
  }

  endDateChange(newEndDate) {
    this.selectedModel.endDate = newEndDate;
    this.emit()
  }
}
