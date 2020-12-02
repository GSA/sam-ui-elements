import { Input, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  template: ''
})
export class SamFieldset {
  /**
   * sets the label text
   */
  @Input() public label: string;
  /**
   * sets the hint text
   */
  @Input() public hint: string;
  /**
   * Set an array of error messages
   */
  @Input() public errorMessages: any[] = [];
  /**
   * set the error message
   */
  @Input() public errorMessage: string;
  /**
   * toggles the required text
   */
  @Input() public required: boolean = false;
  /**
   * Pass in a Form Group for ReactiveForms Support
   */
  @Input() public group: FormGroup;

}
