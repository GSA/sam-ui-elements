import { Component, Output, EventEmitter } from '@angular/core';

/**
 * The <samHeader> component contains navigational links to main sections of the site
 *
 * @Output headerDropdownControl: any - emitted event from child dropdown component
 */
@Component({
  selector: 'samHeader',
  templateUrl: 'header.template.html',
})
export class SamHeaderComponent {


  @Output()
  headerDropdownControl: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  dropdownEventControl(value){
    this.headerDropdownControl.emit(value);
  }

  refreshPage(){
    window.location.reload();
  }

}
