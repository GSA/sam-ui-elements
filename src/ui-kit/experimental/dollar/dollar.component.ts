import {
    Component,
    ChangeDetectorRef,
    Input,
    ViewChild,
    forwardRef,
    Output,
    EventEmitter
  } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { SamFormService } from '../../form-service';
import { KeyHelper } from '../../utilities/key-helper/key-helper';
import { SamFormControl } from '../../form-controls/sam-form-control';

@Component({
    selector: 'sam-dollar',
    templateUrl: 'dollar.template.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SamDollarComponent),
        multi: true
    }]
})
export class SamDollarComponent extends SamFormControl {
  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() public placeholder: string;
  /**
   * (deprecated) Lose focus event emit
   */
  @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Lose focus event emit
   */
  @Output() public blur: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(LabelWrapper, {static: true}) public wrapper: LabelWrapper;

  // type=number starts adding letter 'e' if a max length is not enforced
  strictMaxLength = 16;
  attrType = 'text';
  previousValue = null;
  blurDisabled = false;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(public samFormService: SamFormService,
    public cdr: ChangeDetectorRef) {
      super(samFormService, cdr);
    }

  public ngOnInit() {
    this.setupComponent();
  }

  protected setupComponent(){
    if (!this.id) {
      throw new Error('<sam-dollar> requires a [id] parameter\
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

    this.control.setValidators(validators);

    if (!this.useFormService) {
      this.control.statusChanges
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
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
      this.blurDisabled = true;
      // firefox emits blur event when it switches, temporarily disabling blur handling
      window.setTimeout(()=>{
        this.blurDisabled = false;
      });
  }

  public onLoseFocus() {
    if(this.blurDisabled){
      return;
    }
    this.attrType = 'text';
    const value = this.strToDollar(this.value);
    if (value !== this.previousValue) {
        this.emitChange(value);
        this.previousValue = value;
    }
    this.value = value;
    this.onBlur.emit(true);
    this.blur.emit(true);
  }

  public dollarToStr(value) {
    let strValue = value ? value : "";
    strValue = strValue.replace(/\$/g, '');
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
    if(!value){
      return "";
    }
    let dollarVal = value.trim();
    if (dollarVal !== '') {
        dollarVal = this.roundForCurrency(dollarVal);
        dollarVal = this.numberWithCommas(dollarVal);
        dollarVal = '$' + dollarVal;
    }
    return dollarVal;
  }

  public onInputChange() {
    const value: any = this.strToDollar(this.value);
    this.emitChange(value);
  }

  public emitChange(value) {
    this.onTouched();
    this.onChange(value);
  }
}
