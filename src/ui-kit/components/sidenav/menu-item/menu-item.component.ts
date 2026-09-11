import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SidenavService } from "../services";
import { MenuItem } from "../interfaces";

@Component({
  selector: "sam-menu-item",
  templateUrl: "./menu-item.template.html",
  standalone: false,
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
  @Output() data: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();
  /**
   * Emits when an item has been selected
   */
  @Output() selection: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  constructor(private service: SidenavService) {}

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

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length !== 0);
  }

  emitSelectedChild(event: MenuItem): void {
    this.data.emit(event);
    this.selection.emit(event);
    return;
  }
}
