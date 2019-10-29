import { Component, Host } from '@angular/core';

@Component({
  selector: 'sam-footer-nav-item',
  template: `
    <li class="usa-footer__secondary-link">
      <ng-content></ng-content>
    </li>
  `
})
export class SamFooterNavItemComponent {}
