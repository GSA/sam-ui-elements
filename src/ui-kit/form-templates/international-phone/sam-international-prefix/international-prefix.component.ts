import {
  Component,
  Input,
  Output,
  ChangeDetectorRef, 
  forwardRef} from '@angular/core';

import {
  Validators,
  ValidatorFn,
  NG_VALIDATORS,
  FormControl } from '@angular/forms';

import { SamFormService } from '../../../form-service';

import {
  SamFormControl,
  AccessorToken,
  ValidatorToken
} from '../../../form-controls/sam-form-control';

@Component({
  selector: 'sam-international-prefix',
  templateUrl: 'international-prefix.template.html',
  providers: [
    AccessorToken(SamInternationalPrefix),
    ValidatorToken(SamInternationalPrefix)
  ],
  styles: [
    `.sam-international-prefix {
      text-align: right;
    }`
  ]
})
export class SamInternationalPrefix extends SamFormControl {
  
  public min = 1;
  public max = 999;
  public inputValue: any = 1;
  public defaultValidators = [ this.countryCodeValidator ];

  protected defaultValue = 1;

  constructor (
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef ) {

    super(samFormService, cdr);
  }

  public inputChange (event) {
    this.value = event.target.value 
      ? event.target.value
      : 1;
  }

  public validate (c: FormControl) {
    const errs = this.defaultValidators
      .map(fn => fn(c))
      .filter(err => err);

    return errs.length > 0
      ? errs[0]
      : null;
  }

  private countryCodeValidator (c: FormControl) {
    const message =
      'Country codes cannot exceed 3 digits';
      
    return c && c.value && c.value > 999
      ? { countryCode: { message: message } }
      : null;
  }
}
