import { Directive, HostBinding, Input } from "@angular/core";

@Directive({
  selector: "[samTitleSection]",
  standalone: false,
})
export class SamDatabankTitleSectionDirective {
  @Input() id = "primary-content";
  @HostBinding("class.sam") samClass = true;
  @HostBinding("class.heading") headingClass = true;
  @HostBinding("attr.id") attrId = this.id;
  @HostBinding("attr.tabindex") tabindex = 0;
}
