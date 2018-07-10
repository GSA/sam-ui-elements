import {
  Input,
  OnInit, 
  ViewChild,
  ChangeDetectorRef, 
  AfterViewInit,
  forwardRef } from '@angular/core';

import {
  ControlValueAccessor,
  FormControl,
  ValidatorFn,
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS} from '@angular/forms';

import { SamFormService } from '../../form-service';
import { LabelWrapper } from '../../wrappers/label-wrapper';

export function AccessorToken (className) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => className),
    multi: true
  };
}

export function ValidatorToken (className) {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => className),
    multi: true
  };
}

export class SamFormControl
  implements ControlValueAccessor, OnInit, AfterViewInit {

  /**
   * Sets the label text
   */
  @Input() public label: string;
  /**
   * Sets the name attribute on the input element
   */
  @Input() public name: string;
  /**
   * Sets the id attribute on the input element, 
   * this is linked with the label
   */
  @Input() public id: string;
  /**
   * Sets the title attribute on the input element
   */
  @Input() public title: string;
  /**
   * Sets the hint text under the label
   */
  @Input() public hint: string;
  /**
   * (Deprecated) Sets the error message manually, 
   * errors should be set in the the form controls directly 
   * to populate error messages
   */
  @Input() public errorMessage: string;
  /**
   * Sets the required snippet in the label
   */
  @Input() public required: boolean;
  /**
   * Takes the form control to watch for changes to update 
   * the label error messages
   */
  @Input() public control: FormControl;
  /**
   * (Decprecated) Turns on the SamFormService in order to trigger
   * error message updates programmatically over value/status changes
   * in the form control
   */
  @Input() public useFormService: boolean;
  /**
   * Enable to turn off all validations
   */
  @Input() public disableValidation: boolean;

  @ViewChild(LabelWrapper) public wrapper: LabelWrapper;

  public defaultValidators: ValidatorFn[] = [];

  protected defaultValue: any = null;
  
  protected _value: any = null;
  protected _disabled: boolean;

  public onChange: (_?: any) => any = (_) => { return _; };
  public onTouched: () => any = () => { return; };

  public get value (): any {
    return this._value;
  }

  public set value (val: any) {
    this._value = !val ? this.defaultValue : val;
    this.onChange(this.value);
  }

  public get disabled (): boolean {
    return this._disabled;
  }

  public set disabled (state: boolean) {
    this._disabled = state;
  }

  constructor (
    public samFormService: SamFormService,
    public cdr: ChangeDetectorRef) {}

  // Lifecycle Hooks

  public ngOnInit () {
    this.initReactiveForms();
  }

  public ngAfterViewInit() {
    this.initWrapper();
  }

  // ControlValueAccessor Methods

  public writeValue (val) { 
    this.value = val;
  }

  public registerOnChange (fn) {
    this.onChange = fn;
  }

  public registerOnTouched (fn) {
    this.onTouched = fn;
  }

  public setDisabledState (state) {
    this.disabled = state;
  }

  // Member methods

  private initReactiveForms () {
    if (this.control) {

      const validators: ValidatorFn[] = [];

      if (this.disableValidation) {

        if (this.control.validator) {
          validators.push(this.control.validator);
        }

      } else {

        this.defaultValidators.forEach(
          validator => validators.push(validator)
        );

      }

      this.control.setValidators(validators);

      this.setValidationMethod();
    }
}

private setValidationMethod () {

  if (!this.useFormService) {

    this.control.statusChanges.subscribe(
      (_: any) => {
        this.wrapper.formatErrors(this.control);
        this.cdr.detectChanges();
      },
      (err: any) => console.error('Error occurred')
    );

    } else {

      this.samFormService.formEventsUpdated$
        .subscribe( (evt: any) => {
          if ((!evt.root
            || evt.root === this.control.root)
            && evt.eventType
            && evt.eventType === 'submit') {

            this.wrapper.formatErrors(this.control);

          } else if ((!evt.root
            || evt.root === this.control.root)
            && evt.eventType
            && evt.eventType === 'reset') {

            this.wrapper.clearError();
          }
        }, (err: any) => console.error('Error occured')
      );
    }
  }

  private initWrapper () {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

}
