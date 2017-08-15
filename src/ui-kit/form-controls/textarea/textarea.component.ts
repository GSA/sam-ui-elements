import { Component, Input, ViewChild, forwardRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl } from "@angular/forms";
import {SamFormService} from '../../form-service';

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamTextareaComponent),
  multi: true
};

/**
 * The <sam-text-area> component provides a textarea input form control
 */
@Component({
  selector: 'sam-text-area',
  templateUrl: 'textarea.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamTextareaComponent implements ControlValueAccessor {
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
  * Sets the maxlength attribute
  */
  @Input() maxlength: number;
  @Input() control: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() placeholder: string;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
   * Emits focus event
   */
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Emits event whenever input event is fired on the textarea
   */
  @Output() inputEventChange: EventEmitter<any> = new EventEmitter();

  onChange: any = (_) => {};

  onTouched: any = () => {};

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor(private cdr: ChangeDetectorRef,
    private samFormService:SamFormService) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-text-area> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: any[] = [];

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

  ngAfterViewInit(){
    if (!this.control) {
      return;
    }
    this.wrapper.formatErrors(this.control);
    this.cdr.detectChanges();
  }

  onFocus($event) {
    this.focusEvent.emit($event);
  }

  onInputChange(value) {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  inputEventHandler(event) {
    this.inputEventChange.emit(event);
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
