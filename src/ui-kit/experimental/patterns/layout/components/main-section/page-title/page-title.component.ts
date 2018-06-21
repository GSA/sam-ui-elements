import { Component, Input, HostBinding } from "@angular/core";

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
  @Input('id') public id = 'primary-content';
  @Input() public title: string;
  @Input() public super: string;

  @HostBinding('attr.id') public attrId = this.id;
  @HostBinding('attr.tabindex') public tabindex = 0;

}
