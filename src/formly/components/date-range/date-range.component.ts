import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {AbstractSamFormly} from '../../sam-formly';
import {SamDateRangeComponent} from '../../../ui-kit';

@Component({
  template: `
   <sam-date-range [formControl]="formControl"
    [control]="formControl"
   ></sam-date-range>
 `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamFormlyDateRange extends AbstractSamFormly {
  @ViewChild(SamDateRangeComponent, {static: false})
  public template: SamDateRangeComponent;

  constructor(_cdr: ChangeDetectorRef) {
    super();
    this.cdr = _cdr;
  }
}
