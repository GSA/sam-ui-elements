import {
  Component,
  Input
} from '@angular/core';

export interface ProgressIndicator {
  type: ProgressIndicatorType;
  min: number;
  max: number;
  value: number;
  valueAsText: string;
}

export enum ProgressIndicatorType {
  Percent = 'percent',
  Time = 'time'
}

@Component({
  selector: 'sam-progress',
  templateUrl: 'progress.component.html'
})
export class ProgressComponent implements ProgressIndicator {
  @Input() public label: string;
  @Input() public type: ProgressIndicatorType = ProgressIndicatorType.Percent;
  @Input() public min = 0;
  @Input() public max = 100;
  @Input() public value: number;
  @Input() public valueAsText: string;

  public calculateWidth (): string {
    return Math.min((Math.floor((Math.max(0, this.value)/ this.max) * 100) + 1), 100) + '%';
  }
}



