import {
  Component,
  Input,
  Output,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Type,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentFactory, 
  ComponentRef,
  ChangeDetectorRef,
  Renderer2, 
  ViewEncapsulation, 
  SimpleChanges } from '@angular/core';

import {
  FormGroup,
  FormControl,
  AbstractControl } from '@angular/forms';

import { SamFieldset } from './sam-fieldset/sam-fieldset';

import {
  SamInternationalPrefix
} from './sam-international-prefix';

import { SamFormService } from '../../form-service';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { Subscription } from 'rxjs';

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
  implements OnInit, OnDestroy {

  @Input() public name: string;
  @Input() public useFormService: boolean = true;
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
  private phoneNumberTemplate: string = '(___)___-____';
  private phoneComponentRef: ComponentRef<any>;
  private idError: string =
    'Must provide an id for prefix and phone';
  private prefixSub: Subscription;
  private phoneSub: Subscription;
  
  constructor () {
    super();
  }

  public ngOnInit () {
    const msg = 'Phone and Prefix names required for 508 compliance';
    
    if (!this.phoneName || !this.prefixName) {
      throw new TypeError(msg);
    }

    this.prefixControl = this.group.controls.prefix;
    this.phoneControl = this.group.controls.phone;

    this.prefixSub = this.prefixControl.valueChanges
      .subscribe(
        val => {
          this.countryCode = val;
          /**
           * Necessary to keep group up-to-date with value 
           * changes inside the form control. Without this,
           * it either will not update validation when 
           * country code changes or it will throw a timing
           * error.
           */
          this.phoneControl
            .setValue(this.phoneControl.value);
        },
        err => this._handleError(err)
      );

    this.phoneSub = this.phoneControl.valueChanges
      .subscribe(
        val => {
          this.wrapper.formatErrors(
            this.prefixControl,
            this.phoneControl
          );
        },
        err => this._handleError(err)
      );
  }

  public ngOnDestroy () {
    this.prefixSub.unsubscribe();
    this.phoneSub.unsubscribe();
  }

  private _handleError (err) {
    console.error(err);
  }
}
