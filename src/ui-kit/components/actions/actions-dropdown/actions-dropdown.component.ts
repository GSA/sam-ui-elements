import { Component,
         Input,
         Output,
         EventEmitter,
         ViewChild,
         ElementRef
        } from '@angular/core';

import { SamActionInterface } from '../';

@Component({
  selector: 'sam-actions-dropdown',
  templateUrl: 'actions-dropdown.template.html'
})
export class SamActionsDropdownComponent {
  /**
   * Takes an array of actions for the dropdown
   */
  @Input() public actions: Array<SamActionInterface> = [];
  /**
   * Disable actions
   */
  @Input() public disabled: boolean = false;
  @Input() public buttonType: 'primary'|'default' = 'default';
  /**
   * Emits event when action changes
   */
  @Output() public emitAction: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits result of callback
   */
  @Output() public emitCallback: EventEmitter<any> = new EventEmitter<any>();

  private showActions = false;

  hideActions() {
    return this.showActions = false;
  }

  toggleActions() {
    return this.showActions = !this.showActions;
  }

  chooseAction(action) {
    this.toggleActions();
    this.emitAction.emit(action);
    this.emitCallback.emit(action.callback());
    return;
  }
}
