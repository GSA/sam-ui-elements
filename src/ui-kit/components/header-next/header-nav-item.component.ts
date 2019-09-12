import { Component, Input, Host, OnInit } from '@angular/core';
import { SamHeaderNavComponent } from './header-nav.component';

@Component({
  selector: 'sam-header-nav-item',
  template: `
    <li
      [ngClass]="{
        'usa-nav__primary-item': headerNav.type === 'primary',
        'usa-nav__secondary-item': headerNav.type === 'secondary'
      }"
    >
      <a
        class="usa-nav__link"
        [class.usa-current]="active"
        [routerLink]="route"
        routerLinkActive="usa-current"
      >
        <ng-content></ng-content>
      </a>
    </li>
  `
})
export class SamHeaderNavItemComponent implements OnInit {
  @Input() active: boolean;
  @Input() route: String[];
  constructor(@Host() public headerNav: SamHeaderNavComponent) {}
}
