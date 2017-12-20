import {Component, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, NavigationEnd, UrlSegment } from '@angular/router';
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
     * The listenToRouter property uses the current route to generate
     * breadcrumbs automagically. If applying this property, it is not necessary
     * to provide crumbs via the crumb property.
     */
    @Input() listenToRouter: boolean = false;
    /**
     * The rootCrumb property takes a breadcrumb to be used for the root. It is
     * only necessary to provide this if you are also using the listenToRouter
     * property.
     */
    @Input() rootCrumb: IBreadcrumb = undefined;

    @Output() public crumbActionHandler = new EventEmitter();

    private _routeSubscription: any;
    private count = 0;
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
      /**
       * If listenToRouter is true, use internal function to generate
       * breadcrumbs from routes
       */
      if (this.listenToRouter) {
        this.route.url.subscribe((segments: UrlSegment[]) => {
          // Data load needs to be delayed 
          // Requires setTimeout to load data from route config before running
          // getBreadcrumbs
          setTimeout(() => {
            this.crumbs = this.getBreadcrumbs(this.route.root);
          });
        });
      }
    }

    // Recursive function that takes a route and returns an array of IBreacrumbs
    // from the root to the lowest child
    getBreadcrumbs(
      route: ActivatedRoute,
      url: string = '',
      crumbs: Array<IBreadcrumb> = []): IBreadcrumb[] {
      // Get url from route snapshot
      // Appends to url string of parent
      let updatedUrl = url;
      updatedUrl += route.snapshot.url.reduce((prev, curr) =>  {
        return prev + '/' + curr;
      }, '');

      // Creates a crumb from route snapshot data
      // Breadcrumb property is set on the data property of the route
      let crumbLabel: string;
      if (route.snapshot.data) {
        // This assignment is only here to cast to any to avoid a typescript
        // error
        const data: any = route.snapshot.data as any;
        crumbLabel = data.breadcrumb;
      }

      // If crumb is application root, it sets the crumb to the rootCrumb
      // Else it takes the breadcrumb from the data property
      let crumb: IBreadcrumb;
      if (route.root === route) {
        crumb = {
          breadcrumb: this.rootCrumb.breadcrumb,          
          url: this.rootCrumb.url,
        };
        crumbs.push(crumb);
      } else {
        crumb = {
          breadcrumb: crumbLabel || 'Add Crumb Label to Route',
          url: updatedUrl,
        };
        crumbs.push(crumb);
      }

      // Recursive base case
      // Returns crumbs when route has no more children
      if (route.children.length === 0) {
        return crumbs;
      }

      // If route has children, recurse with child that is currently in the URL
      if (route.children.length > 0) {
        const currentChild: ActivatedRoute = this.getCurrentChild(route);
        return this.getBreadcrumbs(currentChild, updatedUrl, crumbs);
      }
    }

    // Gets child route that is in path of primary outlet
    getCurrentChild(route: ActivatedRoute): ActivatedRoute {
      return route.children.reduce((prev, curr) => {
        if (curr.outlet === 'primary') {
          return curr;
        }
        return prev;
      }, undefined);
    }
    public crumbHandler(crumb: string) {
      this.crumbActionHandler.emit(crumb);
    }
}
