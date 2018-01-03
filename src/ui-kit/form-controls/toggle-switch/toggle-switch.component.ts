import {Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn } from "@angular/forms";

/**
 * SAM Toggle Switch Component
 * Creates a Toggle Switch to use as a form control
 * TODO: Add Form Builder support
 */
@Component({
  selector: 'sam-toggle-switch',
  templateUrl: 'toggle-switch.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamToggleSwitchComponent),
    multi: true
  }]
})
export class SamToggleSwitchComponent implements ControlValueAccessor{
  /**
   * Boolean value to set whether switch is disabled or not
   */
  @Input() disableSwitch: boolean = false;
  /**
   * Boolean value to set whether switch defaults to on
   */
  @Input() isSwitchOn: boolean = false;
  /**
   * String to pass to the label for 508 compliance
   */
  @Input() toggleSwitchText: string = "Toggle Switch";
  /**
   * Event emitter to output the current state of the toggle switch
   */
  @Output() switchStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onSwitchClick(val: boolean): void {
    this.onTouched();
    if(!this.disableSwitch){
      this.isSwitchOn = val;
      this.onChange(val);
      this.switchStatusChange.emit(val);
    }
  }
  
  onChange: any = () => { };
  onTouched: any = () => { };
  
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disableSwitch = disabled;
  }

  writeValue(value:boolean) {
    this.isSwitchOn = value;
  }
}
