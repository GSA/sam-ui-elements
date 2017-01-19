import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samSearchHeader',
  templateUrl: 'search-header.template.html'
})
export class SamSearchHeaderComponent {

  @Input() keyword: string;

  @Input() filterValue: string;

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchHeaderDropdownControl: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(){

  }

  onSearchEvent($event) {
    this.keyword=$event.keyword;
    this.filterValue=$event.searchField;
    this.searchEvent.emit($event);
  }

  dropdownEventControl(value){
    this.searchHeaderDropdownControl.emit(value);
  }
}
