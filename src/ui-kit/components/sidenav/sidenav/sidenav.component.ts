import { Component, OnInit, NgModule } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamMenuItemComponent } from '../menu-item';
import { SidenavService } from '../services';
import { MenuItem } from '../interfaces';

/**
* The <samSidenav> component builds a side navigation bar
*/
@Component({
  selector: 'samSidenav',
  templateUrl: './sidenav.template.html'
})
export class SamSidenavComponent implements OnInit {
  /**
  * Sets active selection in menu
  */
  @Input() selection:number[] = [];
  /**
  * Object that defines the sidenav labels, routes, and structure
  */
  @Input() model: MenuItem;
  /**
  * Event emitted on interaction, returns the selected menu item's path value
  */
  @Output() path: EventEmitter<string> = new EventEmitter<string>();
  /**
  * Event emitted on interaction, returns the selected menu item
  */
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
  ngOnChanges(){
    if(this.selection){
      this.setSelection();
    }
  }
  
  setSelection(){
    for(var i = 1; i <= this.selection.length; i++){
      var idx = this.selection[i-1];
      this.service.overrideData(i-1,idx);
    }
  }

  isSelected(index: number): boolean {
    return this.service.getData()[0] === index;
  }

  updateUI(index: number, event: Event): void {
    this.service.updateData(0, index);
    this.data.emit(this.service.getSelectedModel());
    this.path.emit(this.service.getPath());
    return;
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