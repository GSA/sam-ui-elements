import {
  Directive,
  AfterViewInit,
  ElementRef,
  Renderer2
} from '@angular/core';

@Directive({
  selector: 'a[target]'
})
export class SamExternalLinkDirective
  implements AfterViewInit {

  constructor (
    private el: ElementRef,
    private renderer: Renderer2) {}

  ngAfterViewInit () {
    const span = this.renderer.createElement('span');
    span.innerText = ' (opens in new window)';
    span.classList.add('usa-sr-only');
    this.renderer.appendChild(this.el.nativeElement, span);
  }

}
