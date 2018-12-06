import { Component, Input } from "@angular/core";
import { ProgressIndicator, ProgressIndicatorType } from "../progress.component";

@Component({
  template: `
    <div class="progress-bar" role="progressbar"
      [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="min"
      [attr.aria-valuemax]="max"
      [attr.aria-valuetext]="valueAsText"></div>
    <div class="progress-value">{{ valueAsText }}</div>`
})
export class ProgressTimeComponent implements ProgressIndicator {
  @Input() public type = ProgressIndicatorType.Time;
  @Input() public min = '0';
  @Input() public max = '100';
  @Input() public value: string;
  @Input() public valueAsText: string;
}
