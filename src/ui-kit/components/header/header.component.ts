import { Component, Output, EventEmitter } from '@angular/core';

/**
 * The <sam-header> component contains navigational links to main sections of 
 * the site
 */
@Component({
  selector: 'sam-header',
  templateUrl: 'header.template.html',
})
export class SamHeaderComponent {
  /**
   * Emitted event from child dropdown component
   */
  @Output() headerDropdownControl: EventEmitter<any> = new EventEmitter<any>();

  dropdownEventControl(value) {
    this.headerDropdownControl.emit(value);
  }
  // deprecated
  refreshPage() {
    window.location.reload();
  }

}
