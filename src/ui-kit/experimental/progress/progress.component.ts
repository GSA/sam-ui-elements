import {
  Component,
  Input
} from '@angular/core';

export interface ProgressIndicator {
  type: ProgressIndicatorType;
  min: string;
  max: string;
  value: string;
  valueAsText?: string;
}

export enum ProgressIndicatorType {
  Percent = 'percent',
  Time = 'time'
}

@Component({
  selector: 'sam-progress',
  template: `
  <div class="progress">
    <div class="progress-title">{{ label }}</div>
    <ng-container *ngTemplateOutlet="type === 'percent' ? percent : time"></ng-container>
  </div>

  <ng-template #percent>
    <div class="progress-bar" role="progressbar"
      [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="min"
      [attr.aria-valuemax]="max"></div>
    <div class="progress-value">{{ value }}</div>
  </ng-template>

  <ng-template #time>
    <div class="progress-bar" role="progressbar"
      [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="min"
      [attr.aria-valuemax]="max"
      [attr.aria-valuetext]="valueAsText"></div>
    <div class="progress-value">{{ valueAsText }}</div>
  </ng-template>
  `,
  styles: [
    `
      .progress {
        max-width: 46rem;
      }
    `
  ]
})
export class ProgressComponent implements ProgressIndicator {
  @Input() public label: string;
  @Input() public type: ProgressIndicatorType = ProgressIndicatorType.Percent;
  @Input() public min = '0';
  @Input() public max = '100';
  @Input() public value: string;
  @Input() public valueAsText?: string;
}



