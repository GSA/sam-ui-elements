import {
    Component,
    ContentChild,
    AfterContentInit,
    HostBinding
} from '@angular/core';

@Component({
    selector: 'sam-action-bar',
    template: '<ng-content></ng-content>'
})
export class SamActionBarComponent {}
