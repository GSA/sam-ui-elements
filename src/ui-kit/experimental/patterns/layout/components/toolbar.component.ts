import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MdSidenav } from './sidenav/sidenav';

export type toolbarItem = {
  label: string,
  icon: string,
  disabled?: boolean
};

@Component({
    selector: 'sam-toolbar',
    template: `
  <div class="sam small menu">
    <a *ngIf="sidenav"
    tabindex="0"
    (click)="sidenav.toggle()"
    (keyup.enter)="actionClick(item)">
      Toggle filters
    </a>
    <div class="section right">
      <a *ngFor="let item of contentModel"
      [ngClass]="{disabled: item.disabled}"
      tabindex="0"
      (click)="actionClick(item)"
      (keyup.enter)="actionClick(item)">
        <i class="fa {{item.icon}}" aria-hidden="true"></i>
        {{item.label}}
      </a>
    </div>
  </div>
  `
})

export class SamToolbarComponent {
  /**
   * Passes in the sidebar for toggling
   */
  @Input() sidenav: MdSidenav;
  /**
   * Passes in the content model for the top right items+icons
   */
  @Input() contentModel: toolbarItem[] = [{
    label: "Download",
    icon: 'fa-download'
  }, {
    label: "Share",
    icon: 'fa-share-alt'
  }, {
    label: "Save Criteria",
    icon: 'fa-cloud'
  }];
  /**
   * Emitter for interaction handling
   */
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  actionClick(item){
    if(!item.disabled){
      this.action.emit(item);
    }
  }
}
