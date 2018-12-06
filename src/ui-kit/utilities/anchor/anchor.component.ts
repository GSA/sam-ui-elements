import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[anchor]',
})
export class AnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}