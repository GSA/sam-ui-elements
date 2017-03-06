import {Component, Input, ViewChild, forwardRef} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper/label-wrapper.component';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamNumberComponent),
  multi: true
};

/**
 *
 */
@Component({
  selector: 'samNumber',
  template: `
      <labelWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage" [required]="required">
        <input type="number" [attr.min]="min ? min : null" [attr.max]="max ? max : null" [value]="value" [attr.id]="name" [disabled]="disabled" (change)="onInputChange($event.target.value)">
      </labelWrapper>
  `,
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamNumberComponent implements ControlValueAccessor {
  @Input() value: number;
  @Input() label: string;
  @Input() name: string;
  @Input() min: number;
  @Input() max: number;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() control: FormControl;
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
      throw new Error("<samNumber> requires a [name] parameter for 508 compliance");
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

  onInputChange(value) {
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
