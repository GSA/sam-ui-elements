import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

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
export class SamToggleSwitchComponent implements ControlValueAccessor {
  /**
   * Boolean value to set whether switch is disabled or not
   */
  @Input() public disableSwitch: boolean = false;
  /**
   * Boolean value to set whether switch defaults to on
   */
  @Input() public isSwitchOn: boolean = false;
  /**
   * String to pass to the label for 508 compliance
   */
  @Input() public toggleSwitchText: string = 'Toggle Switch';
  /**
   * Event emitter to output the current state of the toggle switch
   */
  @Output() public switchStatusChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public onSwitchClick(event) {
    this.onTouched();
    if (!this.disableSwitch) {
      let val = event.target.checked;
      this.isSwitchOn = val;
      this.onChange(val);
      this.switchStatusChange.emit(val);

    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }

  public onChange: any = () => undefined;
  public onTouched: any = () => undefined;

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public setDisabledState(disabled) {
    this.disableSwitch = disabled;
  }

  public writeValue(value: boolean) {
    this.isSwitchOn = value;
  }
}
