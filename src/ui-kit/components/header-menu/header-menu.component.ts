import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The MenuItem interface is designed with sam.gov standards to show that this is an official website
 *
 * @property text: Text content for menu item
 * @property routerLink: Valid route through Angular2's routing module
 */
interface MenuItem {
  text: string,
  routerLink?: string
}

/**
 * The <sam-header-menu> component provides a menu dropdown
 */
@Component({
  selector: 'sam-header-menu',
  templateUrl: 'header-menu.component.html'
})
export class SamHeaderMenuComponent {
  /**
  * Array of `MenuItem` objects
  */
  @Input() items: MenuItem[] = [];
  /**
  * Menu open/close callback
  */
  @Output() openChange = new EventEmitter();
  /**
  * Menu open callback
  */
  @Output() onOpen:EventEmitter<any> = new EventEmitter<any>();
  /**
  * Menu close callback
  */
  @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
  /**
  * Menu item click callback
  */
  @Output() onSelect:EventEmitter<any> = new EventEmitter<any>();

  private states = {
    open: false
  };

  private fnFocus = (event) => {
    this.openChange.emit(false);
  };

  @Input()
  set open(open) {
    this.states.open = open;
    this.openChange.emit(this.states.open);

    this.states.open ? this.onOpen.emit() : this.onClose.emit();
    this.states.open ?  this.bind() : this.unbind();
  }

  dispatch() {
    this.onSelect.emit();
  }

  bind() {
    const target = document.getElementById('main-container');
    if(target) {
      target.addEventListener('click', this.fnFocus, false);
    }
  }

  unbind() {
    const target = document.getElementById('main-container');
    if(target) {
      target.removeEventListener('click', this.fnFocus, false);
    }
  }
}
