import { Component, Input, forwardRef } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import * as suffixes from './suffixes.json';
import { NameEntryType } from '../../types';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ControlValueAccessor, FormControl, Validators, ValidatorFn } from "@angular/forms";

let suffixOptions = suffixes.map((item) => {
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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamNameEntryComponent),
    multi: true
  },{
    provide: NG_VALIDATORS, useExisting: forwardRef(() => SamNameEntryComponent), multi: true
  }]
})
export class SamNameEntryComponent implements ControlValueAccessor, Validator {
  private disabled = null;
  private store = {
    suffixes: suffixOptions
  };

  /**
  * The bound value of the component
  */
  @Input() legend: string = "Name"
  /**
  * Label text for template
  */
  @Input() model: NameEntryType = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: ""
  };
  /**
  * Prefix name/id attribute values
  */
  @Input() prefix: string = "";

  fNameErrorMsg: string = "";
  mNameErrorMsg: string = "";
  lNameErrorMsg: string = "";
  suffixErrorMsg: string = "";

  get value(){
    return this.model;
  };

  set value(value: NameEntryType){
    if(!value){
      value = {
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: ""
      };
    }
    this.model = value;
  };

  // validates the form, returns null when valid else the validation object
  // in this case we're checking if the json parsing has passed or failed from the onChange method
  public validate(c: FormControl) {
    var obj = {};
    if(!this.validateFirstName()){
      obj['firstName'] = {
        errorMessage: this.fNameErrorMsg,
        valid: false
      };
    }
    if(!this.validateMiddleName()){
      obj['middleName'] = {
        errorMessage: this.mNameErrorMsg,
        valid: false
      };
    }
    if(!this.validateLastName()){
      obj['lastName'] = {
        errorMessage: this.lNameErrorMsg,
        valid: false
      };
    }
    return Object.keys(obj).length ? obj : null;
  }

  getIdentifer(str){
    if(this.prefix.length>0){
      str = this.prefix + "-" + str;
    }
    return str;
  }

  validateFirstName(){
    var error = false;
    if(/^[0-9]+$/.test(this.model.firstName)){
      error = true;
      this.fNameErrorMsg = "Please enter a valid name";
    }
    if(this.model.firstName.length==0){
      error = true;
      this.fNameErrorMsg = "This field is required";
    }
    if(!error){
      this.fNameErrorMsg = "";
    }
    return !error;
  }

  validateMiddleName(){
    var error = false;
    if(/^[0-9]+$/.test(this.model.middleName)){
      error = true;
      this.mNameErrorMsg = "Please enter a valid name";
    }
    if(!error){
      this.mNameErrorMsg = "";
    }
    return !error;
  }

  validateLastName(){
    var error = false;
    if(/^[0-9]+$/.test(this.model.lastName)){
      error = true;
      this.lNameErrorMsg = "Please enter a valid name";
    }
    if(this.model.lastName.length==0){
      error = true;
      this.lNameErrorMsg = "This field is required";
    }
    if(!error){
      this.lNameErrorMsg = "";
    }
    return !error;
  }

  modelChange(){
    this.onTouched();
    this.onChange(this.model);
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
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
  }
}
