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

  constructor(private service: SidenavService) { }

  updateUI(index: number, event: Event): void {
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
