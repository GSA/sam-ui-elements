import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sam-footer-nav',
  template: `
    <span class="usa-footer__primary-link">{{ title }}</span>
    <ul class="usa-list usa-list--unstyled">
      <ng-content></ng-content>
    </ul>
  `
})
export class SamFooterNavComponent implements OnInit {
  @Input() title: string;
  constructor() {}

  ngOnInit() {}
}
