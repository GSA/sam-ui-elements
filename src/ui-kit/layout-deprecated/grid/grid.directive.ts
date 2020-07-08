import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[grid]'
})
export class GridDirective {
  constructor( private renderer: Renderer2, public el: ElementRef ) {
    renderer.setElementClass(el.nativeElement, 'sam-ui', true);
    renderer.setElementClass(el.nativeElement, 'grid', true);
  }
}
