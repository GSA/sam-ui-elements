import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[row]'
})
export class RowDirective {
  constructor( private renderer: Renderer2, public el: ElementRef ) {
    renderer.addClass(el.nativeElement, 'row');
  }
}
