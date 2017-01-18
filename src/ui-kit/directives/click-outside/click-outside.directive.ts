import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * The <samClickOutside> directive can detect whether a click is made inside the div
 * @Output clickOutside: emit event when clicked outside the div
 */
@Directive({
  selector: '[samClickOutside]'
})
export class SamClickOutsideDirective {

  @Output() clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if(!clickedInside){
      this.clickOutside.emit(null);
    }

  }

  constructor(private _elementRef: ElementRef){
  }



}
