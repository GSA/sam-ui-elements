import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { SamAutocompleteComponent } from "../../../ui-kit";

import { AbstractSamFormly } from "../../sam-formly";

@Component({
  template: `
    <sam-autocomplete
      [formControl]="formControl"
      [control]="formControl"
    ></sam-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyAutocomplete extends AbstractSamFormly {
  @ViewChild(SamAutocompleteComponent, { static: true })
  public template: SamAutocompleteComponent;

  constructor(_cdr: ChangeDetectorRef) {
    super();
    this.cdr = _cdr;
  }
}
