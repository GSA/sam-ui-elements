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
  Nonnumerical = 'nonnumerical'
}

@Component({
  selector: 'sam-progress',
  templateUrl: 'progress.component.html'
})
export class ProgressComponent implements ProgressIndicator {
  /**
   * Whether the progress should be represented as a percent 
   * or a non-numerical value. 
   */
  @Input() public type: ProgressIndicatorType = ProgressIndicatorType.Percent;
  /**
   * The minimum value in the range. If the type is non-numerical, 
   * a default number is provided to calculate the progress for 
   * screen reader users.
   */
  @Input() public min = 0;
  /**
   * The maximum value in the range. If the type is non-numerical, 
   * a default number is provided to calculate the progress for 
   * screen reader users.
   */
  @Input() public max = 100;
  /**
   * The current value of the progress bar. This number should 
   * lie between the min and max.
   */
  @Input() public value: number;
  /**
   * A human readable version of the value. This is provided as
   * a visual display and announced to screen readers if the 
   * type is not Percent.
   */
  @Input() public valueAsText: string;

  /**
   * Calculates the bar fill percentage of the progress bar.
   */
  public calculateBarFillPercentage(): string {
    return Math.min((Math.floor((Math.max(0, this.value) / this.max) * 100)), 100) + '%';
  }
}
