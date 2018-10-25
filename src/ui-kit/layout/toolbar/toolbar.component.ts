import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MdSidenav } from '../../experimental/patterns/layout/components/sidenav';
import { ToolbarItem } from '../../experimental/actions-list';

@Component({
  selector: 'sam-toolbar',
  template: `
  <div class="sam menu">
  <sam-aside-toggle [showToggle]="showToggle" [sidenav]="sidenav"
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
  /**
   * Shows/hides the toggle button in the aside toggle component
   */
  @Input() showToggle = true;
  /**
   * Passes in the sidenav component that the toggle button controls
   */
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
