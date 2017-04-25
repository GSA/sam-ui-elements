import { Component, Input } from '@angular/core';
import { Directive, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'sam-breadcrumbs',
    templateUrl: 'breadcrumbs.template.html'
})
export class SamBreadcrumbsComponent {
    @Input() crumbs: Array<BreadcrumbsModel>;

    constructor(){}
}

export interface BreadcrumbsModel {
    breadcrumb: string;
    url: string;
}

@Directive({
    selector: 'sam-breadcrumbs[use-router]'
})
export class SamBreadcrumbsRouterDirective implements OnInit {
  @Input() breadcrumbs: any;
  @Output() breadcrumbsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
                .filter( event => event instanceof NavigationEnd)
                .subscribe( event => {
                  let newbreadcrumbs = [];
                  let currentRoute = this.route.root;
                  let url = '';
                  do {
                    let children = currentRoute.children;
                    currentRoute = null;
                    children.forEach(route => {
                      if (route.outlet === 'primary') {
                        let routeSnapshot = route.snapshot;
                        url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
                        let crumb: any;
                        if (routeSnapshot.data) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                          crumb = routeSnapshot.data.breadcrumb || undefined;
                        }
                        newbreadcrumbs.push({
                          breadcrumb: crumb || 'xyz',
                          url: url
                        });
                        currentRoute = route;
                      }
                    })
                  } while (currentRoute);
                  this.breadcrumbsChange.emit(newbreadcrumbs);
                  console.log(newbreadcrumbs);
                });
  }

  ngOnInit() {
    
  }
}