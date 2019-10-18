import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import { AbstractSamFormly } from '../../sam-formly';
import { SamDateComponent } from '../../../ui-kit';

@Component({
 template: `
   <sam-date [formControl]="formControl"
    [control]="formControl"
   ></sam-date>
 `,
 changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamFormlyDate extends AbstractSamFormly {
  @ViewChild(SamDateComponent, {static: true})
  public template: SamDateComponent;

  constructor (_cdr: ChangeDetectorRef) {
    super();
    this.cdr = _cdr;
  }
}
