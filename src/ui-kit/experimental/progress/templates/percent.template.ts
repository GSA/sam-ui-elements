import { Component, Input, ChangeDetectorRef } from "@angular/core";
import { ProgressIndicator, ProgressIndicatorType } from "../progress.component";

@Component({
  template: `
  I can see the template
  <div class="progress-bar" role="progressbar"
    [attr.aria-valuenow]="value"
    [attr.aria-valuemin]="min"
    [attr.aria-valuemax]="max"></div>
  <div class="progress-value">{{ value }}</div>`
})
export class ProgressPercentComponent implements ProgressIndicator {
  @Input() public type = ProgressIndicatorType.Percent;
  @Input() public min = '0';
  @Input() public max = '100';
  @Input() public value: string;
  @Input() public valueAsText?: string;

  constructor (public changeDetectorRef: ChangeDetectorRef) {}
}
