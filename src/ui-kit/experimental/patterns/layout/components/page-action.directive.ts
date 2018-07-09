import {
  Directive,
  HostBinding
} from '@angular/core';

@Directive({
  selector: '[samPageAction]'
})
export class SamPageActionDirective {
  @HostBinding('class.page-action')
  public pageActionClass = true;
}