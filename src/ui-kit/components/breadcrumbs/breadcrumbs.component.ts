import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, UrlSegment } from '@angular/router';
import { IBreadcrumb } from '../../types';

@Component({
    selector: 'sam-breadcrumbs',
    templateUrl: 'breadcrumbs.template.html'
})
export class SamBreadcrumbsComponent {
    /**
     * The crumbs property expects an array of breadcrumbs. The last in the list
     * will be set as active
     */
    @Input() crumbs: Array<IBreadcrumb>;
    /**
     * Emits when crumb action occurs
     */
    @Output() public crumbAction = new EventEmitter();

    private _routeSubscription: any;
    private count = 0;

    public crumbHandler(crumb: string) {
      this.crumbAction.emit(crumb);
    }
}
