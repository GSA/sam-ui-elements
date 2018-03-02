import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ViewChildren
} from '@angular/core';

import { SamActionInterface } from '../';
import { KeyHelper } from '../../../utilities/key-helper/key-helper';
@Component({
  selector: 'sam-actions-dropdown',
  templateUrl: 'actions-dropdown.template.html'
})
export class SamActionsDropdownComponent {
  /**
   * identifier that gets set to the ID and aria label attributes for 508
   * compliance
   */
  @Input() public name: string = "action_button";
  /**
   * Takes an array of actions for the dropdown
   */
  @Input() public actions: Array<SamActionInterface> = [];
  /**
   * Disable actions
   */
  @Input() public disabled: boolean = false;
  /**
   * Sets the class of the button (primary or default)
   */
  @Input() public buttonType: 'primary'|'default' = 'default';
  /**
   * Emits event when action changes
   */
  @Output() public emitAction: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits result of callback
   */
  @Output() public emitCallback: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('actionsList') public actionsList;
  private showActions = false;
  focusIndex = -1;
  hideActions() {
    return this.showActions = false;
  }

  toggleActions() {
    if(!this.showActions){
      this.focusIndex = -1;
    }
    return this.showActions = !this.showActions;
  }

  chooseAction(action) {
    this.toggleActions();
    this.emitAction.emit(action);
    if (action.callback) {
      this.emitCallback.emit(action.callback());
    }
    return;
  }

  leadKeyDownHandler(event){
    if(KeyHelper.is("down",event) && !this.showActions){
      this.toggleActions();
      event.preventDefault();
      event.stopPropagation();
    } else if (KeyHelper.is("down",event)){
      this.keyDownHandler(event);
    }
  }

  keyDownHandler(event){
    if(KeyHelper.is("down",event)){
      if(this.focusIndex+1<this.actionsList.toArray().length){
        this.focusIndex++;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    } else if(KeyHelper.is("up",event)){
      if(this.focusIndex-1>=0){
        this.focusIndex--;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
