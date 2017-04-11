import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';


@Directive({
  selector: '[samTabOutside]'
})
export class SamTabOutsideDirective {
  @Output() tabOutside: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:keyup', ['$event.target'])
  public hasFocusChanged(target) {
    const isInsideHost = this._elementRef.nativeElement.contains(target);
    if (!isInsideHost) {
      this.tabOutside.emit(null);
    }
  }
}