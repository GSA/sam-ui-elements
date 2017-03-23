import { Component, Input } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import * as suffixes from './suffixes.json';
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
})
export class SamNameEntryComponent {
  /**
  * The bound value of the component
  */
  @Input() legend: string = "Name"
  /**
  * Label text for template
  */
  @Input() model: any = {
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

}
