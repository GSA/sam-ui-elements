import { Component, Output, EventEmitter } from '@angular/core';

/**
 * The <samHeader> component contains navigational links to main sections of the site
 */
@Component({
  selector: 'samHeader',
  templateUrl: 'header.template.html',
})
export class SamHeaderComponent {
  /**
  * Emitted event from child dropdown component
  */
  @Output() headerDropdownControl: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  dropdownEventControl(value){
    this.headerDropdownControl.emit(value);
  }

  refreshPage(){
    window.location.reload();
  }

}
