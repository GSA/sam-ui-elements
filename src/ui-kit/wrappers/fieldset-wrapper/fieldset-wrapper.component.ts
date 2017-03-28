import { Component, Input } from '@angular/core';
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'fieldset-wrapper',
  templateUrl: 'fieldset-wrapper.template.html',
})
export class FieldsetWrapper {
  @Input() label: string;
  @Input() hint: string;
  @Input() errorMessage: string;

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
            this.errorMessage = `Too many characters (${actualLength} or ${requiredLength})`;
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
