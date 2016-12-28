import { Component, Input } from '@angular/core';

@Component({
  selector: 'fieldset-wrapper',
  templateUrl: 'fieldset-wrapper.template.html',
})
export class FieldsetWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
}
