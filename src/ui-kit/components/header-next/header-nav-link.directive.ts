import {Input, Directive, HostBinding } from '@angular/core';

@Directive({ selector: '[sam-header-nav-link]' })
export class SamHeaderNavLink {
  @HostBinding('class.usa-nav__link') public linkClass: boolean = true;
  @HostBinding('class.usa-current') @Input() active: boolean = false;
  constructor() {}
}
