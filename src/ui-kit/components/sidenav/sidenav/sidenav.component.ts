import { Component, OnInit, NgModule } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamMenuItemComponent } from '../menu-item';
import { SidenavService } from '../services';
import { MenuItem } from '../interfaces';

/**
* The <sam-sidenav> component builds a side navigation bar
*/
@Component({
  selector: 'sam-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SamSidenavComponent implements OnInit {
  /**
  * Sets active selection in menu by matching to a label defined in the model
  */
  @Input() labelLookup:string;
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
  
  ngOnChanges(c){
    if(c['labelLookup'] && this.labelLookup){
      let selection = this.lookupLabelInModel(this.model.children,this.labelLookup,[]);
      if(selection){
        this.setSelection(selection);
      } else {
        console.warn("no sidenav menu item found for \""+this.labelLookup+"\"");
      }
    }
  }

  //recursive label lookup
  lookupLabelInModel(list,lookup,trail){
    if(!list || list.length==0){
      return false;
    } else {
      for(let idx in list){
        if(lookup==list[idx].label){
          trail.push(parseInt(idx));
          return trail;
        } else {
          let updatedTrail = this.lookupLabelInModel(list[idx]['children'],lookup,trail);
          if(updatedTrail){
            updatedTrail.unshift(parseInt(idx));
            return updatedTrail;
          }
        }
      }
    }
  }

  setSelection(selection){
    for(var i = 1; i <= selection.length; i++){
      var idx = selection[i-1];
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
  exports: [ SamSidenavComponent, SamMenuItemComponent ],
  providers: [ SidenavService ]
})
export class SamSidenavModule { }
