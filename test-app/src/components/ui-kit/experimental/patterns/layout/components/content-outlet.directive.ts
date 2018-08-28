import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[samContentOutlet]'
})
export class SamContentOutletDirective {
  @HostBinding('class.content-outlet')
    public hasContentOutletStyle = true;
}
