import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SamActionInterface } from "../action-interface";

@Component({
  selector: "sam-action-button",
  templateUrl: "action-button.template.html",
  standalone: false,
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
  @Output() emitAction: EventEmitter<SamActionInterface> =
    new EventEmitter<SamActionInterface>();
  /**
   * Emits the results of the callback
   */
  @Output() emitCallback: EventEmitter<unknown> = new EventEmitter<unknown>();

  actionClicked() {
    this.emitCallback.emit(this.action.callback());
    this.emitAction.emit(this.action);
  }
}
