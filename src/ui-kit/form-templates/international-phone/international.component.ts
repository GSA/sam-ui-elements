import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef
 } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { SamFieldset } from './sam-fieldset/sam-fieldset';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { SamFormService } from '../../form-service';

@Component({
  selector: 'sam-intl-telephone-group',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .usa-fieldset-inputs {
      max-width: 58rem;
    }

    .sam-international-phone-container {
      flex-wrap: wrap;
      margin-top: 1rem;
      display: flex;
    }
    .sam-international-container {
      display: flex;
      flex: 1;
    }
    .sam-international-phone-prefix {
      max-width: 10rem;
    }

    .sam-international-extension {
      max-width: 15rem;
      margin-left: 1rem;
    }

    .sam-international-telephone {
      margin-left: 1rem;
      flex: 1 1 0;
    }

    .sam-extension {
      width: 100%;
    }

    .sam-extension div {
      width: 100%;
    }

    .sam-extension .label-wrapper-container {
      width: 100%;
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

    @media (max-width: 624px) {
      .sam-international-phone-container{
        display: block;
      }

      .sam-international-extension {
        margin-left: 0rem;
      }
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
  @Input() public extensionLabel = 'Extension';
  @Input() public hasExtension: boolean = false;
  @Input() public extensionName: string;
  @Input() public prefixLabel = 'Country Code';
  @ViewChild(FieldsetWrapper) public wrapper: FieldsetWrapper;
  
  public prefixControl: AbstractControl;
  public phoneControl: AbstractControl;
  public extensionControl: AbstractControl;
  public prefixError: string = '';
  public extensionError: string = '';
  public hint =
    'Country Code is 1 for USA and North America';
  public countryCode: string = '1';
  
  constructor (private _formService: SamFormService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit () {
    const msg = 'Phone, Prefix and Extension names required for 508 compliance';
    
    if (!this.phoneName || !this.prefixName) {
      throw new TypeError(msg);
    }

    if (!this.extensionName && this.hasExtension) {
      throw new TypeError(msg);
    }

    this.group.valueChanges.subscribe(
      change => {
        if (!change.prefix) {
          this.group.patchValue({prefix: '1'});
        } else {
          this.countryCode = change.prefix;
        }
      }
    );

    // Get initial value from Subject
    this.group.updateValueAndValidity();

    this._setValidationStrategy();

    this.prefixControl = this.group.controls.prefix;
    this.phoneControl = this.group.controls.phone;
    this.extensionControl = this.group.controls.extension;
  }

  private _setValidationStrategy () {
    if (!this.useFormService) {
      this._useDefaultStrategy();
    } else {
      this._useFormServiceStrategy();
    }
  }

  private _useFormServiceStrategy (): void {
    this._formService.formEventsUpdated$
      .subscribe(
        (evt: any) => {
          if ((!evt.root
            || evt.root === this.group.root)
            && evt.eventType
            && evt.eventType === 'submit') {

            this.wrapper.formatErrors(
              this.group.controls.prefix,
              this.group.controls.phone,
              this.group.controls.extension
            );

          } else if ((!evt.root
            || evt.root === this.group.root)
            && evt.eventType
            && evt.eventType === 'reset') {

            this.wrapper.clearError();

          }
        },
        (err: any) => console.error('Error occured', err)
      );
  }

  private _useDefaultStrategy (): void {
    this.group.valueChanges.subscribe(
      _ => {

          this.wrapper.formatErrors(
            this.group.controls.prefix,
            this.group.controls.phone,
            this.group.controls.extension
          );
        }
    );
  }

}
