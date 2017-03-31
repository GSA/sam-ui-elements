import { Component, Input, forwardRef } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import * as suffixes from './suffixes.json';
import { NameEntryType } from '../../types';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn} from "@angular/forms";

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input model: any - The bound value of the component
 * @Input legend: string - Label text for template
 * @Input prefix: string - Prefix name/id attribute values
 */
@Component({
  selector: 'samNameEntry',
  templateUrl: 'name-entry.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamNameEntryComponent),
    multi: true
  }]
})
export class SamNameEntryComponent implements ControlValueAccessor{
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

  private store = {
    suffixes: suffixes.map((item) => {
      return {
        label: item.suffix,
        value: item.suffix
      };
    })
  };

  setSubmitted() {
    this.validateFirstName();
    this.validateLastName();
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
    //this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
  }
}
