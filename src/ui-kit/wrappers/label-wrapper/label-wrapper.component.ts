import { Component, Input, ViewChild } from '@angular/core';
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'labelWrapper',
  templateUrl: 'label-wrapper.template.html',
})
export class LabelWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() required: boolean = false;
  @Input() errorMessage: string;

  @ViewChild('labelDiv')
  public labelDiv: any;

  constructor() { }

  formatErrors(control: AbstractControl) {
    if (!control) {
      return;
    }
    if(control.pristine){
      this.errorMessage = "";
      return;
    }

    if (control.invalid && control.errors) {
      for (let k in control.errors) {
        let errorObject = control.errors[k];
        switch (k) {
          case 'maxlength':
            const actualLength = errorObject.actualLength;
            const requiredLength = errorObject.requiredLength;
            this.errorMessage = `${actualLength} characters input but max length is ${requiredLength}`;
            return;
          case 'required':
            this.errorMessage = 'This field cannot be empty';
            return;
          case 'isNotBeforeToday':
            this.errorMessage = "Date must not be before today";
            return;
          default:
            if (errorObject.message) {
              this.errorMessage = errorObject.message;
            } else {
              this.errorMessage = 'Invalid';
            }
            return;
        }
      }
    } else if (control.valid) {
      this.errorMessage = '';
    }
  }
}
