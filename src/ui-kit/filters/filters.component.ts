import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'sam-filters',
  template: `
    <div samAccordion multi="true">
      <!-- Formly creates the Reactive form group from the
      empty group you provide by with the values from the
      model. Fields are used to configure the UI components -->
      <formly-form
        [form]="form"
        [fields]="fields"
        [model]="model"></formly-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFiltersComponent {
  @Input() public form: FormGroup;
  @Input() public fields: FormlyFieldConfig[];
  @Input() public model: any;
}
