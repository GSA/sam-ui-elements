import { Directive, ViewContainerRef, inject } from "@angular/core";

@Directive({
  selector: "[chipHost]",
  standalone: false,
})
export class ChipHostDirective {
  viewContainerRef = inject(ViewContainerRef);
}
