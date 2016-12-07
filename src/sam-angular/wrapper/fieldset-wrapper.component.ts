import { Component, Input } from '@angular/core';

@Component({
  selector: 'fieldsetWrapper',
  template: `
    <div [class.usa-input-error]="!!errorMessage">
      <fieldset class="usa-fieldset-inputs usa-sans">
        <legend [class.usa-input-error-label]="!!errorMessage">{{label}}</legend>
        <span *ngIf="errorMessage" class="usa-input-error-message">{{errorMessage}}</span>
        <span *ngIf="hint" class="usa-form-hint">{{hint}}</span>
        <ng-content></ng-content>
      </fieldset>
    </div>
  `,
})
export class FieldsetWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;

  constructor() { }
}
