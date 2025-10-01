import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sam-main-content',
  standalone: false,
  template: `
    <ng-content select="sam-action-bar"></ng-content>
    <ng-content></ng-content>
  `
})
export class SamMainContentComponent {
  @HostBinding('class.main-content')
    public hasMainContentStyle = true;
}
