import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * SAM Toggle Switch Component
 * Creates a Toggle Switch to use as a form control
 * TODO: Add Form Builder support
 */
@Component({
  selector: 'sam-toggle-switch',
  templateUrl: 'toggle-switch.template.html',
})
export class SamToggleSwitchComponent{
  /**
   * Boolean value to set whether switch is disabled or not
   */
  @Input() disableSwitch: boolean = false;
  /**
   * Boolean value to set whether switch defaults to on
   */
  @Input() isSwitchOn: boolean = false;
  /**
   * Event emitter to output the current state of the toggle switch
   */
  @Output() switchStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onSwitchClick(val: boolean): void {
    this.isSwitchOn = val;
    this.switchStatusChange.emit(val);
  }


}
