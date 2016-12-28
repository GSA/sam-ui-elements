import { Component, Input } from '@angular/core';

@Component({
  selector: 'labelWrapper',
  templateUrl: 'label-wrapper.template.html',
})
export class LabelWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() required: boolean = false;
  @Input() errorMessage: string;
}
