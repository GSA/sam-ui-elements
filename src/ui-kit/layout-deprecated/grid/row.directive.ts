import { Directive, ElementRef, Renderer2, inject } from "@angular/core";

@Directive({
  selector: "[row]",
  standalone: false,
})
export class RowDirective {
  private renderer = inject(Renderer2);
  el = inject(ElementRef);

  constructor() {
    const renderer = this.renderer;
    const el = this.el;

    renderer.addClass(el.nativeElement, "row");
  }
}
