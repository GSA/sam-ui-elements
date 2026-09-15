import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { SamAutocompleteMultiselectComponent } from "../../../ui-kit";
import { AbstractSamFormly } from "../../sam-formly";

@Component({
  template: `
    <sam-autocomplete-multiselect
      [formControl]="formControl"
      [control]="formControl"
    >
    </sam-autocomplete-multiselect>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyAutoCompleteMultiselect extends AbstractSamFormly {
  @ViewChild(SamAutocompleteMultiselectComponent, { static: true })
  public template: SamAutocompleteMultiselectComponent;

  public cdr: ChangeDetectorRef;

  constructor() {
    const _cdr = inject(ChangeDetectorRef);

    super();
    this.cdr = _cdr;
  }
}
