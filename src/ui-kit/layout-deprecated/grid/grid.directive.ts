import { Directive, ElementRef, Renderer2, inject } from "@angular/core";

@Directive({
  selector: "[grid]",
  standalone: false,
})
export class GridDirective {
  private renderer = inject(Renderer2);
  el = inject(ElementRef);

  constructor() {
    const renderer = this.renderer;
    const el = this.el;

    renderer.addClass(el.nativeElement, "sam-ui");
    renderer.addClass(el.nativeElement, "grid");
  }
}
