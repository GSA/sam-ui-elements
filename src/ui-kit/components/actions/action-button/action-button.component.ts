import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SamActionInterface } from '../action-interface';

@Component({
  selector: 'sam-action-button',
  templateUrl: 'action-button.template.html'
})
export class SamActionButton {

  /**
   * Provide the action object for the action button
   */
  @Input() action: SamActionInterface;
  /**
   * Disables the button
   */
  @Input() disabled: boolean = false;
  /**
   * EventEmitter that emits action name when button is clicked
   */
  @Output() emitAction: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits the results of the callback
   */
  @Output() emitCallback: EventEmitter<any> = new EventEmitter<any>();

  actionClicked() {
    this.emitCallback.emit(this.action.callback());
    this.emitAction.emit(this.action);
  }
}
