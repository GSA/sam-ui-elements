import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from "@angular/core";

/**
 * The <sam-click-outside> directive can detect whether a click is made inside
 * the target
 */
@Directive({
  selector: "[sam-click-outside]",
  standalone: false,
})
export class SamClickOutsideDirective {
  private _elementRef = inject(ElementRef);

  /**
   * Event emitted when clicked outside the target
   */
  @Output() clickOutside = new EventEmitter();

  @HostListener("document:click", ["$event.target"])
  public onClick(targetElement) {
    const clickedInside =
      this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(undefined);
    }
  }
}
