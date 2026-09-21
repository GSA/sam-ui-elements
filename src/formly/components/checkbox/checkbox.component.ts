import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";

import { AbstractSamFormly } from "../../sam-formly";
import { SamCheckboxComponent } from "../../../ui-kit";

@Component({
  template: ` <sam-checkbox [formControl]="formControl"></sam-checkbox> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyCheckbox extends AbstractSamFormly {
  cdr = inject(ChangeDetectorRef);

  @ViewChild(SamCheckboxComponent, { static: true })
  public template: SamCheckboxComponent;
}
