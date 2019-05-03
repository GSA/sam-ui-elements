import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  ValidatorFn,
  FormControl,
  ValidationErrors
} from '@angular/forms';

import { SamFormService } from '../../../form-service';

import {
  KeyHelper
} from '../../../utilities/key-helper/key-helper';

import {
  SamFormControl,
  AccessorToken,
  ValidatorToken
} from '../../../form-controls/sam-form-control';
import { numberInputKeys } from '../number-input-keys';

@Component({
  selector: 'sam-extension',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'extension.template.html',
  providers: [
    AccessorToken(SamExtension),
    ValidatorToken(SamExtension)
  ]
})
export class SamExtension extends SamFormControl {
  /**
     * A placeholder value for the extention. In this 
     * component, placeholder should represent the number
     * format, e.g., 1234 .
     */
  placeholder: string = 'ex: 1234';

  /**
   * is extension required
   */
  private keys: KeyHelper = new KeyHelper(...numberInputKeys);
  public inputValue: any = '';

  protected defaultValue = '';
  public defaultValidators = [ this.extensionValidator ];

  public get value(): any {
    return this._value;
  }

  public set value(val: any) {
    this._value = val ? val : this.defaultValue;
    this.inputValue = this._value;
  }

  constructor(
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef) {

    super(samFormService, cdr);
  }


  public ngOnInit() {
    super.ngOnInit();
    this.value = this.defaultValue;
    this.onChange(this.value);
  }

  public inputChange(event) {
    this.value = event.currentTarget.value
      ? event.currentTarget.value
      : '';
    this.onChange(this.value);
  }

  public validate(c: FormControl) {
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
  public writeValue(val: any): void {
    this.value = val;
  }

  private extensionValidator (c: FormControl) {
    const regex: RegExp = /^[0-9]{1,20}$/g;
    const message =
      'Phone extensions must be 20 digits or fewer';

    return c && c.value && !c.value.toString().match(regex)
      ? { extension: { message: message } }
      : null;
  }
}
