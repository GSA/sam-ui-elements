import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

export type ToolbarItem = {
  label: string,
  icon: ToolbarItemIcon,
  disabled?: boolean,
  showMore?: boolean
};

export type ToolbarItemIcon = 'fa-download' | 'fa-share-alt'
  | 'fa-filter' | 'fa-chevron-circle-left';

@Component({
  selector: 'sam-actions',
  template: `
  <div class="section right">
    <ng-container *ngFor="let item of contentModel">
      <button 
        *ngIf="!item.showMore"
        class="sam button tertiary small"
        [ngClass]="{disabled: item?.disabled}"
        [disabled]="item?.disabled"
        (click)="actionClick(item)"
        (keyup.enter)="actionClick(item)">
        <i class="fa {{item?.icon}}" aria-hidden="true"></i>
        {{item?.label}}
      </button>
    </ng-container>
    <sam-actions-dropdown
      *ngIf="showMoreActions.length > 0"
      [text]="'More'"
      [actions]="showMoreActions"
      (emitAction)="dropdownClick($event)">
    </sam-actions-dropdown>
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
  public showMoreActions = [];

  public actionClick (item) {
    if (!item.disabled) {
      this.action.emit(item);
    }
  }

  public dropdownClick(item) {
    let matchedItem = this.contentModel.find(modelItem => {
      if (modelItem.label === item.label) {
        return true;
      }
    });
    if (matchedItem) {
      this.actionClick(matchedItem);
    }
  }

  public ngOnChanges(c) {
    if (c.contentModel && this.contentModel) {
      this.showMoreActions = [];
      for (let item of this.contentModel) {
        if (item.showMore) {
          let showMoreAction = {
            name: item.label,
            label: item.label,
            icon: 'fa ' + item.icon
          };
          this.showMoreActions.push(showMoreAction);
        }
      }
    }
  }
}
