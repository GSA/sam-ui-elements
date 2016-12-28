import { Component, Input } from '@angular/core';

@Component({
  selector: 'sam-fieldset-wrapper',
  templateUrl: 'fieldset-wrapper.template.html',
})
export class SamFieldsetWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
}
