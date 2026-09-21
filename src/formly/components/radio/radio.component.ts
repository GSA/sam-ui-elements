import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { SamRadioButtonComponent } from "../../../ui-kit";
import { AbstractSamFormly } from "../../sam-formly";

@Component({
  template: `
    <sam-radio-button [formControl]="formControl" [control]="formControl">
    </sam-radio-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyRadio extends AbstractSamFormly {
  @ViewChild(SamRadioButtonComponent, { static: true })
  public template: SamRadioButtonComponent;

  public cdr: ChangeDetectorRef;

  constructor() {
    const _cdr = inject(ChangeDetectorRef);

    super();
    this.cdr = _cdr;
  }
}
