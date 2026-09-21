import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from "@angular/core";

@Directive({
  selector: "[sam-tab-outside]",
  standalone: false,
})
export class SamTabOutsideDirective {
  private _elementRef = inject(ElementRef);

  /**
   * Emitter for tabOutside event
   */
  @Output() tabOutside: EventEmitter<void> = new EventEmitter();

  @HostListener("document:keyup", ["$event.target"])
  public hasFocusChanged(target: EventTarget | null): void {
    const isInsideHost =
      target instanceof Node && this._elementRef.nativeElement.contains(target);
    if (!isInsideHost) {
      this.tabOutside.emit(undefined);
    }
  }
}
