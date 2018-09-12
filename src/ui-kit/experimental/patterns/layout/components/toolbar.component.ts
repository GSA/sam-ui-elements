import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MdSidenav } from './sidenav';
import { ToolbarItem } from '../../../actions-list';

@Component({
  selector: 'sam-toolbar',
  template: `
  <div class="sam small menu">
  <sam-aside-toggle [sidenav]="sidenav"
  [contentModel]="sidenavModel"
  (toggle)="action.emit($event)">
  </sam-aside-toggle>
  <sam-actions [contentModel]="contentModel"
  (action)="action.emit($event)"
  ></sam-actions>
  </div>
  `
})
export class SamToolbarComponent {
  @Input() public sidenav: MdSidenav;
  /**
  * Passes in the content model for the top right items+icons
  */
  @Input() contentModel: ToolbarItem[] = [
    {
      label: 'Save',
      icon: 'fa-filter'
    },
    {
      label: 'Download',
      icon: 'fa-download'
    }, 
    {
      label: 'Share',
      icon: 'fa-share-alt',
      disabled: true
    }
  ];
  
  @Input() sidenavModel: ToolbarItem = {
    label: 'Toggle Filters',
    icon: 'fa-chevron-circle-left',
    disabled: false
  }
  /**
  * Emitter for interaction handling
  */
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
}
