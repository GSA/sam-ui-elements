import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
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
  template: `
  <div>
    <div class="progress-title">{{ valueAsText }}</div>
    <ng-container *ngTemplateOutlet="type === 'percent' ? percent : time"></ng-container>
  </div>

  <ng-template #percent>
    <div class="progress-container">
      <div class="progress-bar animated"
        [ngClass]="{'hasProgress': hasProgress()}"
        [style.width]="calculateWidth()"
        role="progressbar"
        [attr.aria-valuenow]="value"
        [attr.aria-valuemin]="min"
        [attr.aria-valuemax]="max"></div>
    </div>
  </ng-template>

  <ng-template #time>
    <div class="progress-container">
      <div class="progress-bar animated"
        [ngClass]="{'hasProgress': hasProgress()}"
        style.width]="calculateWidth()"
        role="progressbar" 
        [attr.aria-valuenow]="value"
        [attr.aria-valuemin]="min"
        [attr.aria-valuemax]="max"></div>
    </div>
  </ng-template>
  `,
  styles: [
    ` .progress-value {
        text-align: right;
      }

      .progress-container {
        width: 100%;
        background-color: #D6D7D9;
      }

      .progress-bar.hasProgress {
        background-color: #2E8540;
      }

      .progress-bar {
        height: 1rem;
        border-radius: 4px;
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
      }

      .progress-bar.animated {
        transition: 0.4s linear;
        transition-property: width, background-color;
      }
    `
  ],
  changeDetectionStrategy: ChangeDetectionStrategy.OnPush
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

  public hasProgress (): boolean {
    return this.value > this.min;
  }
}



