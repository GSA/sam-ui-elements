import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidenavService } from '../services';
import { MenuItem } from '../interfaces';

@Component({
  selector: 'sam-menu-item',
  templateUrl: './menu-item.template.html'
})
export class SamMenuItemComponent {
  /**
   * Sets additional children in menu item
   */
  @Input() children: MenuItem[];
  /**
   * Indicates how deep this menu item is in the tree
   */
  @Input() nodeDepth: number;
  /**
   * (deprecated) Emits when an item has been selected
   */
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits when an item has been selected
   */
  @Output() selection: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service: SidenavService) { }

  updateUI(index: number, event: Event, menuItem: MenuItem): void {
    if (menuItem && menuItem.disabled) {
      return;
    }
    this.service.updateData(this.nodeDepth, index);
    this.data.emit(this.service.getSelectedModel());
    this.selection.emit(this.service.getSelectedModel());
    return;
  }

  isSelected(index: number): boolean {
    return this.service.getData()[this.nodeDepth] === index;
  }

  hasChildren(item: object) {

    if (item['children'] && item['children'].length !== 0) {
      return true
    } else {
      return false;
    }

  }

  emitSelectedChild(event: any): void {
    this.data.emit(event);
    this.selection.emit(event);
    return;
  }
}
