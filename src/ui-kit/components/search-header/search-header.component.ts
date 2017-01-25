import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <samSearchHeader> component draws attention to new or important content.
 *
 * @Input keyword: string - Sets the search input text
 * @Input filterValue: string - Sets the search index value
 * @Input searchEvent: any - Event emitted on a search action
 * @Input searchHeaderDropdownControl: any - Event emitted on child dropdown action
 */
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
