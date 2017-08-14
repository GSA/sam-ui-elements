import {Component, Input, ViewChild, forwardRef, Output, EventEmitter} from '@angular/core';
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
   * Lose focus event emit
   */
  @Output() onBlur:EventEmitter<boolean> = new EventEmitter<boolean>();

  onChange: any = (c) => { };
  onTouched: any = () => { };
  onLoseFocus: any = () => {this.onBlur.emit(true)};

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor(private samFormService:SamFormService) {}

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
      });
      this.wrapper.formatErrors(this.control);
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

  onInputChange(value) {
    if(this.control){
      this.control.markAsDirty();
      this.control.markAsTouched();
      this.control.setValue(value);
    }
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
    this.value = value;
  }
}
