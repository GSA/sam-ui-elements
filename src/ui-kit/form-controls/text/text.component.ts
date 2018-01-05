import {Component, ChangeDetectorRef, Input, ViewChild, forwardRef, Output, EventEmitter} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn} from "@angular/forms";
import {SamFormService} from '../../form-service';
export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamTextComponent),
  multi: true
};

/**
 * The <sam-text> component provides a text input form control
 */
@Component({
  selector: 'sam-text',
  templateUrl: 'text.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamTextComponent implements ControlValueAccessor {
  /**
  * Sets the text input value
  */
  @Input() value: string = '';
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the name attribute
  */
  @Input() name: string;
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string;
  /**
  * Sets the general error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the disabled attribute
  */
  @Input() disabled: boolean;
  /**
  * Sets the required attribute
  */
  @Input() required: boolean;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Sets the maxlength attribute
  */
  @Input() maxlength: number;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() placeholder: string;
  /**
   * (deprecated) Lose focus event emit
   */
  @Output() onBlur:EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Lose focus event emit
   */
  @Output() blur:EventEmitter<boolean> = new EventEmitter<boolean>();

  onChange: any = (c) => { };
  onTouched: any = () => { };
  onLoseFocus(){
    if(this.value.trim()!=this.value){
      this.onInputChange(this.value.trim());
    }
    this.onBlur.emit(true);
    this.blur.emit(true);
  };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor(private samFormService:SamFormService,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-text> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: ValidatorFn[] = [];

    if(this.control.validator){
      validators.push(this.control.validator);
    }

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxlength) {
      validators.push(Validators.maxLength(this.maxlength));
    }
    this.control.setValidators(validators);

    if(!this.useFormService){
      this.control.statusChanges.subscribe(()=>{
        this.wrapper.formatErrors(this.control);
        this.cdr.detectChanges();
      });
    }
    else {
      this.samFormService.formEventsUpdated$.subscribe(evt=>{
        if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='submit'){
          this.wrapper.formatErrors(this.control);
        } else if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='reset'){
          this.wrapper.clearError();
        }
      });
    }
  }

  ngAfterViewInit(){
    if(this.control){
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  onInputChange(value) {
    this.onTouched();
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value!=null ? "" + value: "";
  }
}
