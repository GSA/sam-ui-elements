import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { AbstractSamFormly } from '../sam-formly';
import { SamCheckboxComponent } from '../../ui-kit';

@Component({
 template: `
   <sam-checkbox [formControl]="formControl"></sam-checkbox>
 `,
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFormlyCheckbox extends AbstractSamFormly {
  @ViewChild(SamCheckboxComponent)
  public template: SamCheckboxComponent;

  constructor (public cdr: ChangeDetectorRef) {
    super();
  }
}
