import { Component, Input, Output,ChangeDetectorRef, Optional, ViewChild, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { OptionsType } from '../../types';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

const noop = () => {};
const MY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamSelectComponent),
  multi: true
};

/**
 * The <sam-select> component is a select/options group form control
 */
@Component({
  selector: 'sam-select',
  templateUrl: 'select.template.html',
  providers: [MY_VALUE_ACCESSOR]
})
export class SamSelectComponent implements ControlValueAccessor, AfterViewInit {
  /**
  * Sets the bound value of the component
  */
  @Input() model: string|number|symbol;
  /**
  * Sets the array of option values and text (see OptionsType)
  */
  @Input() options: OptionsType[];
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the semantic description for the component
  */
  @Input() name: string;
  /**
  * Sets the helpful text for the using the component
  */
  @Input() hint: string;
  /**
  * Sets the general error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the general error message
  */
  @Input() required: boolean;
  /**
  * Sets the general error message
  */
  @Input() disabled: boolean;
  /**
  * Sets the general error message
  */
  @Input() control: FormControl;
  /**
  * Event emitted on modal value change
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper)
  public wrapper: LabelWrapper;

  @ViewChild("select")
  public select: any;

  constructor(@Optional() private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-select> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    this.control.statusChanges.subscribe(()=>{
      this.wrapper.formatErrors(this.control);
    });
  }

  ngAfterViewInit(){
    if (!this.control) {
      return;
    }
    this.wrapper.formatErrors(this.control);
    this.cdr.detectChanges();
  }

  onSelectChange(val) {
    if (this.onChange) {
      this.onChange(val);
    }
    this.model = val;
    this.modelChange.emit(val);
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.model = value;
  }

  onBlur() {
    this.wrapper.formatErrors(this.control);
    if (this.onTouched) {
      this.onTouched();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private onChange: (_: any) => void;
  private onTouched: () => void;
}
