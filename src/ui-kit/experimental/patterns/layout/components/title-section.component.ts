import {
  Directive,
  HostBinding,
  Input
} from '@angular/core';

@Directive({
  selector: '[samTitleSection]'
})
export class SamDatabankTitleSectionDirective {
  @Input('id') id = 'primary-content';
  @HostBinding('class.sam') samClass = true;
  @HostBinding('class.heading') headingClass = true;
  @HostBinding('attr.id') attrId = this.id;
  @HostBinding('attr.tabindex') tabindex = 0;
}
