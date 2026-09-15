import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";

import { AbstractSamFormly } from "../../sam-formly";
import { SamDateComponent } from "../../../ui-kit";

@Component({
  template: `
    <sam-date [formControl]="formControl" [control]="formControl"></sam-date>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyDate extends AbstractSamFormly {
  @ViewChild(SamDateComponent, { static: true })
  public template: SamDateComponent;

  constructor() {
    const _cdr = inject(ChangeDetectorRef);

    super();
    this.cdr = _cdr;
  }
}
