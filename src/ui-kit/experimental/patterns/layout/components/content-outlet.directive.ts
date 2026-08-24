import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[samContentOutlet]",
  standalone: false,
})
export class SamContentOutletDirective {
  @HostBinding("class.content-outlet")
  public hasContentOutletStyle = true;
}
