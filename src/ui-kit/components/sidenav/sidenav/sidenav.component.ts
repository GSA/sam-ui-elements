import { Component, OnInit, NgModule } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamMenuItemComponent } from '../menu-item';
import { SidenavService } from '../services';
import { SamStickyComponent } from 'ui-kit';
import { MenuItem } from '../interfaces';

@Component({
  selector: 'samSidenav',
  templateUrl: './sidenav.template.html'
})
export class SamSidenavComponent implements OnInit {
  @Input() model: MenuItem;
  @Output() path: EventEmitter<string> = new EventEmitter<string>();
  @Output() data: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service: SidenavService) { }

  ngOnInit(): void {
    if (!this.model || !this.model.label || !this.model.children) {
      throw new Error('You must include a model which implements the MenuItem interface to use this component.');
    }
    if (!this.path) {
      console.warn('You will not have access to path without including a callback for path.');
    }
    if (!this.data) {
      console.warn('You will not have access to the data of the selected item without including a callback for data.');
    }
    this.service.setModel(this.model);
    this.service.setChildren(this.model.children);
  }

  isSelected(index: number): boolean {
    return this.service.getData()[0] === index;
  }

  updateUI(index: number, event: Event): void {
    this.service.setSelected(event.target);
    this.service.updateData(0, index);
    this.data.emit(this.service.getSelectedModel());
    this.path.emit(this.service.getPath());
    return;
  }

  isNodeSelected(node: EventTarget): boolean {
    return this.service.getSelected() === node;
  }

  emitChildData(event: Event): void {
    this.data.emit(event);
    this.path.emit(this.service.getPath());
    return;
  }

}

@NgModule({
  imports: [ CommonModule ],
  declarations: [ SamSidenavComponent, SamMenuItemComponent],
  exports: [ SamSidenavComponent ],
  providers: [ SidenavService ]
})
export class SamSidenavModule { }