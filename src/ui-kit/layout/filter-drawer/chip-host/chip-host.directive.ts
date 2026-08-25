import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[chipHost]",
  standalone: false,
})
export class ChipHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
