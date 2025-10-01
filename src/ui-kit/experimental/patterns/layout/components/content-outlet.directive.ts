import { Directive, HostBinding } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[samContentOutlet]'
})
export class SamContentOutletDirective {
  @HostBinding('class.content-outlet')
    public hasContentOutletStyle = true;
}
