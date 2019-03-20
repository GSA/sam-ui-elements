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
  SamFormControl,
  AccessorToken,
  ValidatorToken
} from '../../../form-controls/sam-form-control';

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
  public maxLength = 20;
  @ViewChild('input') public input: ElementRef;

  public inputValue: any = '';

  protected defaultValue = '';

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
      : '1';

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

  public writeValue(val: any): void {
    this.value = val;
  }
}
