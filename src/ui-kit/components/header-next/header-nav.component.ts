import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sam-header-nav',
  template: `
    <ul
      [ngClass]="{
        'usa-nav__primary usa-accordion': type === 'primary',
        'usa-nav__secondary-links': type === 'secondary'
      }"
    >
      <ng-content></ng-content>
    </ul>
  `
})
export class SamHeaderNavComponent implements OnInit {
  @Input() type: string;
  constructor() {}

  ngOnInit() {}
}
