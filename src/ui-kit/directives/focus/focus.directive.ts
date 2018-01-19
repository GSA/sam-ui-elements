import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[sam-focus]', 
})
export class SamFocusDirective {
  /**
   * Event emitter for focus event
   */
  @Output() focus = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside =
      this._elementRef.nativeElement.contains(targetElement);
    if (clickedInside) {
      this.focus.emit(undefined);
    }
  }
  
  @HostListener('document:keyup', ['$event.target'])
  public hasFocusChanged(target) {
    const isInsideHost = this._elementRef.nativeElement.contains(target);
    if (isInsideHost) {
      this.focus.emit(undefined);
    }
  }
}
