import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * The <samClickOutside> directive can detect whether a click is made inside the target
 */
@Directive({
  selector: '[samClickOutside]'
})
export class SamClickOutsideDirective {
  /**
  * Event emitted when clicked outside the target
  */
  @Output() clickOutside = new EventEmitter();

  constructor(private _elementRef: ElementRef){}
  
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if(!clickedInside){
      this.clickOutside.emit(null);
    }
  }
}
