import { Component, Host } from '@angular/core';

@Component({
  selector: 'sam-footer-nav-item',
  standalone: false,
  template: `
    <li class="usa-footer__secondary-link">
      <ng-content></ng-content>
    </li>
  `
})
export class SamFooterNavItemComponent {}
