import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    ViewChildren
} from '@angular/core';

import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';
import {SamActionInterface} from '../action-interface';

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
  @Input() public text: string = 'Actions';
  /**
   * Sets the aria-label of action button
   */
  @Input() public ariaLabelButtonText: string = 'Actions';
  /**
   * Emits event when action changes
   */
  @Output() public emitAction: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits result of callback
   */
  @Output() public emitCallback: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('actionsList') public actionsList;

  @ViewChild('actionButton') public actionButton;

  showActions = false;
  focusIndex = -1;

  hideActions(event) {
    return this.showActions = false;
  }

  toggleActions() {
    this.showActions = !this.showActions;
    if(this.showActions) {
      this.setFocusOnFirstItem();
    } else {
      this.focusIndex = -1;
    }
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
    if(KeyHelper.is(KEYS.DOWN,event) && !this.showActions){
      this.toggleActions();
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.keyDownHandler(event);
    }
  }

  setFocusOnFirstItem() {
    this.actionsList.changes.subscribe(t => {
      this.ngForRendered();
    })
  }

  ngForRendered() {
    if(this.actionsList.length > 0) {
      this.focusIndex = 0;
      this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
    }
  }

  keyDownHandler(event){
    if(KeyHelper.is(KEYS.DOWN, event)){
      if(this.focusIndex+1<this.actionsList.toArray().length){
        this.focusIndex++;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      } else {
        this.focusIndex = 0;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    } else if(KeyHelper.is(KEYS.UP,event)){
      if(this.focusIndex-1>=0){
        this.focusIndex--;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      } else {
        this.focusIndex = this.actionsList.toArray().length - 1;
        this.actionsList.toArray()[this.focusIndex].nativeElement.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    } else if (KeyHelper.is(KEYS.ESC, event)){
      if(this.showActions) {
        this.toggleActions();
      }
      this.actionButton.nativeElement.focus();
    }
  }
}
