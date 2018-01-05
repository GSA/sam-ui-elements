import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[grid]'
})
export class GridDirective{
  constructor( private renderer : Renderer, public el : ElementRef ){
    renderer.setElementClass(el.nativeElement, "sam-ui", true);
    renderer.setElementClass(el.nativeElement, "grid", true);
  }
}