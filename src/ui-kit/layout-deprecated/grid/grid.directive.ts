import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[grid]'
})
export class GridDirective {
  constructor( private renderer: Renderer2, public el: ElementRef ) {
    renderer.addClass(el.nativeElement, 'sam-ui');
    renderer.addClass(el.nativeElement, 'grid');
  }
}
