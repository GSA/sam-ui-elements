import {
  Component,
  Input,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'sam-page-title',
  template: `
    <h1 class="sam heading">
      <span class="intro">
        {{ super }} 
      </span>
      {{ title }} 
    </h1>
    <ng-content></ng-content>
  `
})
export class SamPageTitle {
  /**
   * Skip nav target ID, should be unique
   */
  @Input('id') public id = 'primary-content';
  /**
   * Main text of the title
   */
  @Input() public title: string;
  /**
   * Super text of the title
   */
  @Input() public super: string;

  @HostBinding('attr.id') public attrId = this.id;
  @HostBinding('attr.tabindex') public tabindex = 0;
}
