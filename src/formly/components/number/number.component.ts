import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";

import { AbstractSamFormly } from "../../sam-formly";
import { SamNumberComponent } from "../../../ui-kit";

@Component({
  template: `
    <sam-number
      [formControl]="formControl"
      [control]="formControl"
    ></sam-number>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyNumber extends AbstractSamFormly {
  @ViewChild(SamNumberComponent, { static: true })
  public template: SamNumberComponent;

  constructor() {
    const _cdr = inject(ChangeDetectorRef);

    super();
    this.cdr = _cdr;
  }
}
