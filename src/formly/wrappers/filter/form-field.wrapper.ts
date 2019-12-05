import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'sds-formly-wrapper-form-field',
  template: `
  <div  [class.usa-input-error]="showError">
    <label 
    [attr.for]="id"
    [class.usa-input-error-label]="showError">
      {{ label || '' }}
      <span *ngIf="to.required"
        class="usa-additional_text">
        Required
      </span>
      {{ to.label }}
  </label>

  <span *ngIf="showError"
  class="usa-input-error-message"
  [attr.id]="errorElId">
  <formly-validation-message [field]="field"></formly-validation-message>
</span>
<ng-template #fieldComponent></ng-template>
  </div>
  `,
})
export class FormlyWrapperFormFieldComponent extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent!: ViewContainerRef;
}
