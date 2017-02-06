import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SidenavService } from '../services';
import { MenuItem } from '../interfaces';

@Component({
  selector: 'samMenuItem',
  templateUrl: './menu-item.template.html'
})
export class SamMenuItemComponent {
  @Input() children: MenuItem[];
  @Input() private nodeDepth: number;
  @Output() private data: EventEmitter<any> = new EventEmitter<any>();

  private path: string;

  constructor(private service: SidenavService) { }

  updateUI(index: number, event: Event): void {
    this.service.setSelected(event.target);
    this.service.updateData(this.nodeDepth, index);
    this.data.emit(this.service.getSelectedModel());
    return;
  }

  isSelected(index: number): boolean {
    return this.service.getData()[this.nodeDepth] === index;
  }

  isNodeSelected(node: EventTarget): boolean {
    return this.service.getSelected() === node;
  }

  emitSelectedChild(event: any): void {
    this.data.emit(event);
    return;
  }
}
