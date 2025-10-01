import {Input, Directive, HostBinding } from '@angular/core';

@Directive({ 
  standalone: false,
  selector: '[sam-header-nav-link]' 
})
export class SamHeaderNavLink {
  @HostBinding('class.usa-current') @Input() active: boolean = false;
  constructor() {}
}
