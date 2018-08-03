import {
    Component, Input, Output, EventEmitter, HostBinding
} from '@angular/core';
import 'rxjs/add/observable/merge';
import { SamMainComponent } from '../';
import { SamPageNextService } from '../../architecture';

@Component({
    selector: 'sam-reporting-main',
    templateUrl: './reporting-main.template.html',
})
export class SamReportingMainComponent extends SamMainComponent {
    @HostBinding('class.sam-reporting-main') public reportingMainClass = true;
    constructor(public _service: SamPageNextService){
        super(_service);
    }
}
