import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription';

import { LabelWrapper } from '../../wrappers/label-wrapper';
import { SamFormService } from '../../form-service';

/**
 * The <sam-text> component provides a text input form control
 */
@Component({
  selector: 'sam-text',
  templateUrl: 'text.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamTextComponent),
      multi: true
    }
  ]
})
export class SamTextComponent implements ControlValueAccessor,
  OnInit, AfterViewInit, OnDestroy {
  /**
  * Sets the text input value
  */
  @Input() public value = '';
  /**
  * Sets the label text
  */
  @Input() public label: string;
  /**
  * Sets the id attribute
  */
  @Input() public id: string;
  /**
  * Sets the name attribute
  */
  @Input() public name: string;
  /**
  * Sets the helpful hint text
  */
  @Input() public hint: string;
  /**
  * Sets the general error message
  */
  @Input() public errorMessage: string;
  /**
  * Sets the disabled attribute
  */
  @Input() public disabled: boolean;
  /**
  * Sets the required attribute
  */
  @Input() public required: boolean;
  /**
  * Sets the required attribute
  */
  @Input() public optional: boolean = true;
  /**
  * Passes in the Angular FormControl
  */
  @Input() public control: FormControl;
  /**
  * Sets the maxlength attribute
  */
  @Input() public maxlength: number;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() public useFormService: boolean;
  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() public placeholder: string;
  /**
   * Sets the title attribute on the input for accessibility
   */
  @Input() public title: string;
  /**
   * Changes the HTML event the changes emit on
   */
  @Input() public emitOn: 'input' | 'change' = 'input';
  /**
   * Toggles default component validations
   */
  @Input() public defaultValidations: boolean = true;
  /**
   * (deprecated) Lose focus event emit
   */
  @Output() public onBlur = new EventEmitter<boolean>();
  /**
   * Lose focus event emit
   */
  @Output() public blur = new EventEmitter<boolean>();

  @ViewChild(LabelWrapper) public wrapper: LabelWrapper;
  
  public onChange: any = (c) => null;
  public onTouched: any = () => null;

  public focusEvent = new Subject<any>();
  public changeEvent = new Subject<any>();

  private _focusSubscription: Subscription;
  private _changeSubsription: Subscription;
  private ngUnsubscribe = new Subject<any>();

  constructor(private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) {}

  public ngOnInit (): void {
    this._validateInputs();
    this._setupSubscriptions();
    this._setupFormControl();
  }

  public ngAfterViewInit (): void {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  public ngOnDestroy (): void {
    this._unsubscribe();
    this.cdr.detach();
  }

  public onLoseFocus (): void {
    this._trimWhitespace();
    this.onBlur.emit(true);
    this.blur.emit(true);
  }

  public registerOnChange (fn): void {
    this.onChange = fn;
  }

  public registerOnTouched (fn): void {
    this.onTouched = fn;
  }

  public setDisabledState (disabled): void {
    this.disabled = disabled;
  }

  public writeValue (value): void {
    this.value = value !== null
      ? '' + value
      : '';
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }

  private _validateInputs (): void {
    if (!this.name) {
      throw new Error('<sam-text> requires a [name] parameter\
       for 508 compliance');
    }
  }

  private _setupSubscriptions (): void {
    this._focusSubscription =
      this.focusEvent
        .subscribe(
          this._handleFocusEvents.bind(this)
        );

    this._changeSubsription = 
      this.changeEvent
        .filter(event => event.type === this.emitOn)
        .subscribe(
          e => this._setValue.call(this, e.event.target.value)
        );
  }

  private _setupFormControl (): void {
    if (!this.control) {
      return;
    }

    this.control.setValidators(this._getValidators());

    if (!this.useFormService) {
      this.control.statusChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.wrapper.formatErrors(this.control);
        this.cdr.detectChanges();
      });
    } else {
      this.samFormService.formEventsUpdated$
      .subscribe((evt: any) => {
        if (this._isSubmitEvent(evt)) {
          this.wrapper.formatErrors(this.control);
        } else if (this._isResetEvent(evt)) {
          this.wrapper.clearError();
        }
      });
    }
  }

  private _unsubscribe (): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this._focusSubscription.unsubscribe();
    this._changeSubsription.unsubscribe();
  }

  private _trimWhitespace () {
    const trimmed = this.value.trim();
    if (trimmed !== this.value) {
      this._setValue(trimmed);
    }
  }

  private _setValue (value): void {
    this.value = value;
    this.onChange(this.value);
  }

  private _handleFocusEvents (event): void {
    if (event.type === 'focus') {
      this.onTouched();
    } else if (event.type === 'blur') {
      this.onLoseFocus();
    }
  }

  private _getValidators (): any[] {
    const validators: ValidatorFn[] = [];

    if (this.control.validator) {
      validators.push(this.control.validator);
    }
    if(this.defaultValidations){
      if (this.required || !this.optional) {
        validators.push(Validators.required);
      }

      if (this.maxlength) {
        validators.push(Validators.maxLength(this.maxlength));
      }
    }

    return validators;
  }

  private _isSubmitEvent (evt): boolean {
    return (!evt.root || evt.root === this.control.root)
      && evt.eventType && evt.eventType === 'submit';
  }

  private _isResetEvent (evt): boolean {
    return (!evt.root || evt.root === this.control.root)
      && evt.eventType && evt.eventType === 'reset';
  }
}
