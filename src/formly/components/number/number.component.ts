import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {AbstractSamFormly} from '../../sam-formly';
import {SamNumberComponent} from '../../../ui-kit';

@Component({
  template: `
   <sam-number [formControl]="formControl"
    [control]="formControl"
   ></sam-number>
 `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamFormlyNumber extends AbstractSamFormly {
  @ViewChild(SamNumberComponent, {static: false})
  public template: SamNumberComponent;

  constructor(_cdr: ChangeDetectorRef) {
    super();
    this.cdr = _cdr;
  }
}
