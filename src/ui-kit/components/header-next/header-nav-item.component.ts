import { Component, Host } from '@angular/core';
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
      <ng-content></ng-content>
    </li>
  `
})
export class SamHeaderNavItemComponent {
  constructor(@Host() public headerNav: SamHeaderNavComponent) {}
}