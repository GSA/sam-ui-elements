import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidenavService } from '../services';
import { MenuItem } from '../interfaces';

@Component({
  selector: 'sam-menu-item',
  templateUrl: './menu-item.template.html'
})
export class SamMenuItemComponent {
  @Input() children: MenuItem[];
  @Input() nodeDepth: number;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service: SidenavService) { }

  updateUI(index: number, event: Event, menuItem: MenuItem): void {
    if(menuItem && menuItem.disabled){
      return;
    }
    this.service.updateData(this.nodeDepth, index);
    this.data.emit(this.service.getSelectedModel());
    return;
  }

  isSelected(index: number): boolean {
    return this.service.getData()[this.nodeDepth] === index;
  }

  emitSelectedChild(event: any): void {
    this.data.emit(event);
    return;
  }
}
