import {Component, Input, ViewChild, forwardRef} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn} from "@angular/forms";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamTextComponent),
  multi: true
};

/**
 * The <samText> component provides a text input form control
 */
@Component({
  selector: 'samText',
  templateUrl: 'text.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamTextComponent implements ControlValueAccessor {
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
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Sets the maxlength attribute
  */
  @Input() maxlength: number;

  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor() {

  }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samText> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: ValidatorFn[] = [];

    if(this.control.validator){
      validators.push(this.control.validator);
    }
    
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

  onInputChange(value) {
    if(this.control){
      this.control.markAsDirty();
      this.control.markAsTouched();
      this.control.setValue(value);
    }
    this.value = value;
    this.onChange(value);
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
