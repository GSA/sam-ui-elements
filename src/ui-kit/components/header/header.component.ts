import { Component, Output, EventEmitter } from '@angular/core';

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
