import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { SamFieldset } from './sam-fieldset/sam-fieldset';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';

@Component({
  selector: 'sam-intl-telephone-group',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .usa-fieldset-inputs {
      max-width: 46rem;
    }

    .sam-international-phone-container {
      display: flex;
    }

    .sam-international-phone-prefix {
      max-width: 12rem;
    }

    .sam-international-phone-container * {
      display: inline-block;
    }

    .sam-international-telephone {
      margin-left: 1rem;
      flex-grow: 3;
    }

    .sam-telephone {
      width: 100%;
    }

    .sam-telephone div {
      width: 100%;
    }

    .sam-telephone .label-wrapper-container {
      width: 100%;
    }
    `
  ],
  templateUrl: 'international.template.html'
})
export class SamIntlPhoneGroup extends SamFieldset
  implements OnInit {

  @Input() public name: string;
  @Input() public useFormService: boolean = false;
  @Input() public useDefaultValidations: boolean = true;
  @Input() public phoneName: string;
  @Input() public prefixName: string;
  @Input() public phoneLabel = 'Phone';
  @Input() public prefixLabel = 'Country Code';

  @ViewChild(FieldsetWrapper) public wrapper: FieldsetWrapper;
  
  public prefixControl: AbstractControl;
  public phoneControl: AbstractControl;
  public prefixError: string = '';
  public hint =
    'Country Code is 1 for USA and North America';
  public countryCode: any;

  public errorStrategy: (...any) => boolean = this._defaultStrategy;
  
  constructor () {
    super();
  }

  public ngOnInit () {
    const msg = 'Phone and Prefix names required for 508 compliance';
    
    if (!this.phoneName || !this.prefixName) {
      throw new TypeError(msg);
    }

    this.group.valueChanges.subscribe(
      change => {
        if (!change.prefix) {
          this.group.patchValue({prefix: '1'})
        } else {
          this.countryCode = change.prefix;
          if (this.errorStrategy()) {
            this.wrapper.formatErrors(
              this.group.controls.prefix,
              this.group.controls.phone
            );
          }
        }
      }
    )

    this.prefixControl = this.group.controls.prefix;
    this.phoneControl = this.group.controls.phone;
  }

  private _defaultStrategy (): boolean {
    return true;
  }

}
