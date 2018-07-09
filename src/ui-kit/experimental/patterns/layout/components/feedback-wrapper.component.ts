import {
    Component,
    ContentChild,
    AfterContentInit,
    HostBinding
} from '@angular/core';

@Component({
    selector: 'sam-feedback-wrapper',
    template: '<ng-content></ng-content>'
})
export class SamFeedbackWrapperComponent {
}
