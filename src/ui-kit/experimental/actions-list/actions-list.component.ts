import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

export type ToolbarItem = {
  label: string,
  icon: ToolbarItemIcon,
  disabled?: boolean
};

export type ToolbarItemIcon = 'fa-download' | 'fa-share-alt'
  | 'fa-cloud' | 'fa-bars';

@Component({
  selector: 'sam-actions',
  template: `
    <div class="section right">
      <button class="sam button link"
        [ngClass]="{disabled: item?.disabled}"
        [disabled]="item?.disabled"
        (click)="actionClick(item)"
        (keyup.enter)="actionClick(item)"
        *ngFor="let item of contentModel">
        <i class="fa {{item?.icon}}" aria-hidden="true"></i>
        {{item?.label}}
      </button>
    </div>
  `
})
export class SamActionsListComponent {
  /**
   * Passes in the content model for the top right items+icons
   */
  @Input() contentModel: ToolbarItem[] = [];
  /**
   * Emitter for interaction handling
   */
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  public actionClick (item) {
    if (!item.disabled) {
      this.action.emit(item);
    }
  }
}
