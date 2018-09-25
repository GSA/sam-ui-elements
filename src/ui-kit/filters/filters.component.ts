import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Optional,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';
import { SamPageNextService } from '../experimental/patterns/layout/architecture';

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

  constructor (@Optional() private _service: SamPageNextService) {}

  public ngOnChanges (c: SimpleChanges) {
    if (this._service && c.fields) {
      this._service.get('filterFields').setValue(this.fields);
    }
  }
}
