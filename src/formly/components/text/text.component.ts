import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import { AbstractSamFormly } from '../../sam-formly';
import { SamTextComponent } from '../../../ui-kit';

@Component({
 template: `
   <sam-text [formControl]="formControl"></sam-text>
 `,
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFormlyText extends AbstractSamFormly {
  @ViewChild(SamTextComponent) public template: SamTextComponent;

  constructor (public cdr: ChangeDetectorRef) {
    super();
  }
}
