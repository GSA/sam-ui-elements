import {
  Component, HostBinding, forwardRef
} from '@angular/core';

import { SamMainComponent } from '../';
import { SamPageNextService } from '../../architecture';

@Component({
  selector: 'sam-reporting-main',
  templateUrl: './reporting-main.template.html',
  providers: [
    {
      provide: SamMainComponent,
      useValue: forwardRef(() => SamReportingMainComponent)
    }
  ]
})
export class SamReportingMainComponent extends SamMainComponent {
  @HostBinding('class.sam-reporting-main')
  public reportingMainClass = true;

  constructor (public _service: SamPageNextService) {
    super(_service);
  }
}
