import {
  Component,
  ChangeDetectionStrategy,
  ViewChild, ChangeDetectorRef
} from '@angular/core';
import {SamAutocompleteMultiselectComponent} from '../../../ui-kit';
import {AbstractSamFormly} from '../../sam-formly';

@Component({
  template: `
    <sam-autocomplete-multiselect [formControl]="formControl" [control]="formControl">
    </sam-autocomplete-multiselect>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFormlyAutoCompleteMultiselect extends AbstractSamFormly {
  @ViewChild(SamAutocompleteMultiselectComponent)
  public template: SamAutocompleteMultiselectComponent;

  public cdr: ChangeDetectorRef;

  constructor(_cdr: ChangeDetectorRef) {
    super();
    this.cdr = _cdr;
  }
}
