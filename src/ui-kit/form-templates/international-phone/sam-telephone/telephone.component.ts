import {
  Component,
  Input,
  OnChanges,
  ChangeDetectorRef, 
  SimpleChanges, 
  ViewEncapsulation } from '@angular/core';

import {
  ValidatorFn,
  FormControl, 
  ValidationErrors } from '@angular/forms';

import { SamFormService } from '../../../form-service';

import {
  SamFormControl,
  AccessorToken,
  ValidatorToken
} from '../../../form-controls/sam-form-control';
import { KeyHelper } from '../../../utilities/key-helper/key-helper';
import  { numberInputKeys} from '../number-input-keys';
@Component({
  selector: 'sam-telephone',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'telephone.template.html',
  providers: [
    AccessorToken(SamTelephone),
    ValidatorToken(SamTelephone)
  ]
})
export class SamTelephone extends SamFormControl
  implements OnChanges {

  /**
   * A number representing the country code. This number
   * is used internally by this component to set the 
   * appropriate validator.
   */
  @Input() countryCode: number = 1;
  
  /**
   * A placeholder value for the phone format. In this 
   * component, placeholder should represent the number
   * format, e.g., (___)___-____ for USA numbers.
   */
  @Input() placeholder: string = 'ex: (555)555-5555';
  
  private keys: KeyHelper = new KeyHelper(...numberInputKeys);
  
  public defaultValidators: ValidatorFn[] = [];
  public inputValue: any;
  public template: string = '(___)___-____';

  protected defaultValue: number = null;
  protected _value: any;

  public get value () {
    return this._value;
  }

  public set value (val: any) {
    this._value = this.templateToNumber(val);
    this.inputValue = this.numberToTemplate(this._value);
    this.onChange(this._value);
  }

  constructor (
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef ) {

    super(samFormService, cdr);
  }

  public ngOnChanges (c: SimpleChanges): void {
    if (c.countryCode) {
      this.setValidatorByCountry(
        c.countryCode.currentValue
      );

      this.value = this.value;
    }
  }

  public validate (c: FormControl): ValidationErrors {
    const errs = this.defaultValidators
      .map(fn => fn(c))
      .filter(err => err);

    return errs.length > 0
      ? errs[0]
      : null;
  }

  onKeyInput(event){
    if (!this.keys.isAllowed(event)) {
      event.preventDefault();
      return;
    }
  }
  public inputChange (event: any): void {
    const target = (<HTMLInputElement>event.currentTarget);

    if (target) {
      this.value = this.templateToNumber(target.value);
    }
  }

  public handleFocus (event: any): void {
    const target = (<HTMLInputElement>event.currentTarget);
    
    if (target) {
      this.inputValue =
        this.templateToNumber(target.value);
    }
  }

  public handleBlur (event: any): void {
    const target = (<HTMLInputElement>event.currentTarget);
    
    if (target) {
      this.inputValue =
        this.numberToTemplate(target.value);
    }
  }

  private numberToTemplate (numberStr: string): string {
    if (!numberStr) {
      return;
    }

    const digits = numberStr
      .split('')
      .filter(digit => digit.match(/([^_\)\(-\s])/g));

    const blanks = this.template
      ? this.template.split('')
      : [];

    return blanks
      .map(
        blank => {
          if (blank === '_') {
            const next = digits.shift();
            return next ? next : blank;
          } else {
            return blank;
          }
        }
      )
      .join('')
      .concat(digits.join(''));
  }

  private templateToNumber (template: string): string {
    if (!template) {
      return;
    } else {
      return template
        .split('')
        .filter(char => char.match(/([^_\)\(-\s])/g))
        .join('');
    }
  }

  private setValidatorByCountry (code: number): void {
    this.defaultValidators = [];

    if (!code || code.toString() === '1') {
      this.defaultValidators.push(this.usaValidator());
      this.template = '(___)___-____';
    } else {
      this.defaultValidators.push(this.intlValidator());
      this.template = '';
    }
  }

  private usaValidator (): ValidatorFn {

    return (c: FormControl): { [key: string]: any } => {
      const usaRegex: RegExp = /^[0-9]{10}$/g;
      const message =
        'North American phone numbers must be 10 digits';
      
      return c && c.value && !c.value.match(usaRegex)
        ? { usaPhone: { message: message } }
        : null;
    };
  }

  private intlValidator (): ValidatorFn {

    return (c: FormControl): { [key: string]: any} => {
      const message =
        'International phone numbers must be between 4 and 15 digits';

      return c && c.value && this.isValidIntlNumber(c.value)
        ? { intlPhone: { message: message } }
        : null;
    };
  }

  private isValidIntlNumber (val: string): boolean {
    const intlRegex: RegExp = /^[0-9]{4,15}$/g;

    return !val.match(intlRegex);
  }
}
