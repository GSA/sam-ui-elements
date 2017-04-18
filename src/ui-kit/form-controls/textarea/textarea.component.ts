import { Component, Input, ViewChild, forwardRef, Output, EventEmitter } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl } from "@angular/forms";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamTextareaComponent),
  multi: true
};

/**
 * The <samTextArea> component provides a textarea input form control
 */
@Component({
  selector: 'samTextArea',
  templateUrl: 'textarea.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamTextareaComponent implements ControlValueAccessor {
  /**
  * Sets the text input value
  */
  @Input() value: string = '';
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the name attribute
  */
  @Input() name: string;
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string;
  /**
  * Sets the general error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the disabled attribute
  */
  @Input() disabled: boolean;
  /**
  * Sets the required attribute
  */
  @Input() required: boolean;
  /**
  * Sets the maxlength attribute
  */
  @Input() maxlength: number;
  @Input() control: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() placeholder: string;

  @Output() focusEvent: EventEmitter<any> = new EventEmitter();

  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };

  onTouched: any = () => {

  };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor() {

  }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samTextArea> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: any[] = [];

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxlength) {
      validators.push(Validators.maxLength(this.maxlength));
    }

    this.control.setValidators(validators);
    this.control.valueChanges.subscribe(this.onChange);
    this.wrapper.formatErrors(this.control);
  }

  onFocus($event) {
    this.focusEvent.emit($event);
  }

  onInputChange(value) {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
  }
}
