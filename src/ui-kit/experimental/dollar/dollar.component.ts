import {
    Component,
    ChangeDetectorRef,
    Input,
    ViewChild,
    forwardRef,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit
  } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { SamFormService } from '../../form-service';
import { KeyHelper } from '../../utilities/key-helper/key-helper';

@Component({
    selector: 'sam-dollar',
    templateUrl: 'dollar.template.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SamDollarComponent),
        multi: true
    }]
})
export class SamDollarComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  /**
  * Sets the text input value
  */
  @Input() public value: string = '';
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
   * (deprecated) Lose focus event emit
   */
  @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Lose focus event emit
   */
  @Output() public blur: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(LabelWrapper) public wrapper: LabelWrapper;

  strictMaxLength = 16;
  attrType = 'text';
  previousValue = null;
  private ngUnsubscribe: Subject<any> = new Subject();
  public onChange: any = (c) => null;
  public onTouched: any = () => null;

  constructor(private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    if (!this.name) {
      throw new Error('<sam-dollar> requires a [name] parameter\
       for 508 compliance');
    }

    if (!this.control) {
      return;
    }

    const validators: ValidatorFn[] = [];

    if (this.control.validator) {
      validators.push(this.control.validator);
    }

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxlength) {
      validators.push(Validators.maxLength(this.maxlength));
    }
    this.control.setValidators(validators);

    if (!this.useFormService) {
      this.control.statusChanges.takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.wrapper.formatErrors(this.control);
        this.cdr.detectChanges();
      });
    } else {
      this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
        if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'submit') {
          this.wrapper.formatErrors(this.control);
        } else if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'reset') {
          this.wrapper.clearError();
        }
      });
    }
  }

  public ngOnDestroy() {
    this.cdr.detach();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngAfterViewInit() {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  public numberWithCommas (x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  public onFocus() {
      this.onTouched();
      this.value = this.dollarToStr(this.value);
      this.cdr.detectChanges();
      this.attrType = 'number';
  }

  public onLoseFocus() {
    this.attrType = 'text';
    const value = this.strToDollar(this.value);
    if (value !== this.previousValue) {
        this.onInputChange2(value);
        this.previousValue = value;
    }
    this.value = value;
    this.onBlur.emit(true);
    this.blur.emit(true);
  }

  public dollarToStr(value) {
    let strValue = value.replace(/\$/g, '');
    strValue = strValue.replace(/,/g, '');
    return strValue;
  }
  
  public onKeyInput(event){
    if((''+this.value).length > this.strictMaxLength && 
        KeyHelper.getNumberFromKey(event)!== undefined) {
        return false;
    }
  }

  public roundForCurrency(number): string{
    number = parseFloat(''+ Math.round( number * 100 ) / 100).toFixed(2);
    number = '' + number;
    return number;
  }

  public strToDollar(value) {
    let dollarVal = value.trim();
    if (dollarVal !== '') {
        dollarVal = this.roundForCurrency(dollarVal);
        dollarVal = this.numberWithCommas(dollarVal);
        dollarVal = '$' + dollarVal;
    }
    return dollarVal;
  }

  public onInputChange() {
    this.onTouched();
    const value: any = this.strToDollar(this.value);
    this.onChange(value);
  }

  public onInputChange2(value) {
    this.onTouched();
    this.onChange(value);
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public setDisabledState(disabled) {
    this.disabled = disabled;
  }

  public writeValue(value) {
    this.value = value !== null
      ? '' + value
      : '';
  }
}
