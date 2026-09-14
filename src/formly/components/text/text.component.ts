import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from "@angular/core";

import { AbstractSamFormly } from "../../sam-formly";
import { SamTextComponent } from "../../../ui-kit";

@Component({
  template: `
    <sam-text [formControl]="formControl" [control]="formControl"></sam-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamFormlyText extends AbstractSamFormly {
  cdr = inject(ChangeDetectorRef);

  @ViewChild(SamTextComponent, { static: true })
  public template: SamTextComponent;
}
