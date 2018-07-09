import {
    Component,
    ContentChild,
    AfterContentInit,
    HostBinding
} from '@angular/core';


@Component({
    selector: 'sam-resources-wrapper',
    template: '<ng-content></ng-content>'
})
export class SamResourcesWrapperComponent {
}
