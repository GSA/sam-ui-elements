import {Input, Directive, HostBinding } from '@angular/core';

@Directive({ selector: '[sam-header-nav-link]' })
export class SamHeaderNavLink {
  @HostBinding('class.usa-current') @Input() active: boolean = false;
  constructor() {}
}
