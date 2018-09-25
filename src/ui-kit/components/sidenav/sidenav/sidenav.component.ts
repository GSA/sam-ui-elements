import {
  Component,
  OnInit,
  NgModule,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
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
   * Sets type of side navigation, currently there are two options 
   * 'default' & 'step'
   */
  @Input() type: string;
  /**
   * Sets active selection in menu by matching to a label defined in the model
   */
  @Input() labelLookup: string;
  /**
   * Object that defines the sidenav labels, routes, and structure
   */
  @Input() model: MenuItem;
  /**
   * (deprecated) Event emitted on interaction, returns the selected menu 
   * item's path value
   */
  @Output() path: EventEmitter<string> = new EventEmitter<string>();
  /**
   * (deprecated) Event emitted on interaction, returns the selected menu item
   */
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Event emitted on interaction, returns the selected menu item's path value
   */
  @Output() pathChange: EventEmitter<string> = new EventEmitter<string>();
  /**
   * Event emitted on interaction, returns the selected menu item
   */
  @Output() selection: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private service: SidenavService) { }

  ngOnInit(): void {
    if (!this.model || !this.model.label || !this.model.children) {
      throw new Error('You must include a model which implements the MenuItem \
        interface to use this component.');
    }
    if (!this.path) {
      console.warn('You will not have access to path without including a \
        callback for path.');
    }
    if (!this.data) {
      console.warn('You will not have access to the data of the selected item \
        without including a callback for data.');
    }
    this.service.setModel(this.model);
    this.service.setChildren(this.model.children);
  }

  ngOnChanges(c) {
    if(c.model) {
      //if model changes, need set to new model, and reset to 0 index tab
      this.service.setModel(this.model);
      this.service.setChildren(this.model.children);
      if(c.model.previousValue){
        this.updateUI(0, null, null);
      }
    }
    if (c.labelLookup && this.labelLookup) {
      const selection =
        this.lookupLabelInModel(this.model.children, this.labelLookup, []);
      if (selection) {
        this.setSelection(selection);
      } else {
        console.warn(`no sidenav menu item found for "${this.labelLookup}"`);
      }
    }
  }

  // recursive label lookup
  lookupLabelInModel(list, lookup, trail) {
    if (!list || list.length === 0) {
      return false;
    } else {
      for (const idx in list) {
        if (lookup === list[idx].label) {
          trail.push(parseInt(idx, undefined));
          return trail;
        } else {
          const updatedTrail =
            this.lookupLabelInModel(list[idx].children, lookup, trail);
          if (updatedTrail) {
            updatedTrail.unshift(parseInt(idx, undefined));
            return updatedTrail;
          }
        }
      }
    }
  }

  setSelection(selection) {
    for (let i = 1; i <= selection.length; i++) {
      const idx = selection[i - 1];
      this.service.overrideData(i - 1, idx);
    }
  }

  isSelected(index: number): boolean {
    return this.service.getData()[0] === index;
  }

  updateUI(index: number, event: Event, menuItem: MenuItem): void {
    if (menuItem && menuItem.disabled) {
      return;
    }
    this.service.updateData(0, index);
    this.data.emit(this.service.getSelectedModel());
    this.path.emit(this.service.getPath());
    this.selection.emit(this.service.getSelectedModel());
    this.pathChange.emit(this.service.getPath());
    return;
  }

  emitChildData(event: Event): void {
    this.data.emit(event);
    this.path.emit(this.service.getPath());
    this.selection.emit(event);
    this.pathChange.emit(this.service.getPath());
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
