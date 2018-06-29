import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef } from '@angular/core';

import { FormControl } from '@angular/forms';

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

  @ViewChild('input') public input: ElementRef;

  public min = 1;
  public max = 999;
  public inputValue: any = '1';
  public defaultValidators = [ this.countryCodeValidator ];

  protected defaultValue = '1';

  constructor (
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef ) {

    super(samFormService, cdr);
  }

  public ngOnInit () {
    this.value = this.defaultValue;
  }

  public inputChange (event) {
    this.value = event.currentTarget.value
      ? event.currentTarget.value
      : '1';
    this.input.nativeElement.value = this.value;
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
    const regex: RegExp = /^[0-9]{1,3}$/g;
    const message =
      'Country codes must be 3 numbers or fewer';

    return c && c.value && !c.value.toString().match(regex)
      ? { countryCode: { message: message } }
      : null;
  }
}
