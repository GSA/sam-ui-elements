import { Component, Input, forwardRef } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import * as suffixes from './suffixes.json';
import { NameEntryType } from '../../types';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

const suffixOptions = (suffixes as any).map((item) => {
  return {
    label: item.suffix,
    value: item.suffix
  };
});

suffixOptions.unshift({
  label: 'None',
  value: ''
});

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input model: any - The bound value of the component
 * @Input legend: string - Label text for template
 * @Input prefix: string - Prefix name/id attribute values
 */
@Component({
  selector: 'sam-name-entry',
  templateUrl: 'name-entry.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamNameEntryComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SamNameEntryComponent),
      multi: true
    }
  ]
})
export class SamNameEntryComponent implements ControlValueAccessor, Validator {
  /**
  * The bound value of the component
  */
  @Input() public legend: string = 'Name';
  /**
  * Label text for template
  */
  @Input() public model: NameEntryType = {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: ''
  };
  /**
  * Prefix name/id attribute values
  */
  @Input() public prefix: string = '';

  public fNameErrorMsg: string = '';
  public mNameErrorMsg: string = '';
  public lNameErrorMsg: string = '';
  public suffixErrorMsg: string = '';

  public get value() {
    return this.model;
  }

  public set value(value: NameEntryType) {
    let val = value;
    if (!val) {
      val = {
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: ''
      };
    }
    this.model = val;
  }

  private disabled = undefined;
  private store = {
    suffixes: suffixOptions
  };

  public setSubmitted() {
    this.validateFirstName();
    this.validateLastName();
  }

  // validates the form, returns null when valid else the validation object
  // in this case we're checking if the json parsing has passed or failed from 
  // the onChange method
  public validate(c: FormControl) {
    const obj: any = {};
    if (!this.validateFirstName()) {
      obj.firstName = {
        errorMessage: this.fNameErrorMsg,
        valid: false
      };
    }
    if (!this.validateMiddleName()) {
      obj.middleName = {
        errorMessage: this.mNameErrorMsg,
        valid: false
      };
    }
    if (!this.validateLastName()) {
      obj.lastName = {
        errorMessage: this.lNameErrorMsg,
        valid: false
      };
    }
    return Object.keys(obj).length ? obj : undefined;
  }

  public getIdentifer(str) {
    let newString = str;
    if (this.prefix.length > 0) {
      newString = this.prefix + '-' + newString;
    }
    return newString;
  }

  public validateFirstName() {
    let error = false;
    if (/^[0-9]+$/.test(this.model.firstName)) {
      error = true;
      this.fNameErrorMsg = 'Please enter a valid name';
    }
    if (this.model.firstName.length === 0) {
      error = true;
      this.fNameErrorMsg = 'This field is required';
    }
    if (!error) {
      this.fNameErrorMsg = '';
    }
    return !error;
  }

  public validateMiddleName() {
    let error = false;
    if (/^[0-9]+$/.test(this.model.middleName)) {
      error = true;
      this.mNameErrorMsg = 'Please enter a valid name';
    }
    if (!error) {
      this.mNameErrorMsg = '';
    }
    return !error;
  }

  public validateLastName() {
    let error = false;
    if (/^[0-9]+$/.test(this.model.lastName)) {
      error = true;
      this.lNameErrorMsg = 'Please enter a valid name';
    }
    if (this.model.lastName.length === 0) {
      error = true;
      this.lNameErrorMsg = 'This field is required';
    }
    if (!error) {
      this.lNameErrorMsg = '';
    }
    return !error;
  }

  public modelChange() {
    this.onTouched();
    this.onChange(this.model);
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
    this.disabled = disabled;
  }

  public writeValue(value) {
    this.value = value;
  }
}
