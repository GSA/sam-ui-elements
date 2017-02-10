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
 * The <sam-header-menu> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input items: Array of `MenuItem` objects
 * @Input open: Boolean for setting menu open/close states (2-way binding)
 *
 * @Output onOpen: Menu open callback
 * @Output onClose: Menu close callback
 * @Output onSelect: Menu item click callback
 */
@Component({
  selector: 'sam-header-menu',
  templateUrl: 'header-menu.component.html'
})
export class SamHeaderMenuComponent {
  @Input() items: MenuItem[] = [];

  @Output() openChange = new EventEmitter();
  @Output() onOpen:EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
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
