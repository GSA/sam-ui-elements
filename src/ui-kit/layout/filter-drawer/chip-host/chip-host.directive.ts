import {
  Directive,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[chipHost]',
})
export class ChipHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
