import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[row]'
})
export class RowDirective{
  constructor( private renderer : Renderer, public el : ElementRef ){
    renderer.setElementClass(el.nativeElement, "row", true);
  }
}