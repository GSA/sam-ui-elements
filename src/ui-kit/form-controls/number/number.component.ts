import {Component, ChangeDetectorRef, Input, ViewChild, forwardRef} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper/label-wrapper.component';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";
import {SamFormService} from '../../form-service';

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamNumberComponent),
  multi: true
};

/**
 *
 */
@Component({
  selector: 'sam-number',
  template: `
      <sam-label-wrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage" [required]="required">
        <input 
          type="number" 
          [attr.min]="min ? min : null" 
          [attr.max]="max ? max : null" 
          [value]="value" 
          [attr.id]="name" 
          [disabled]="disabled" 
          (keydown)="keyDownHandler($event)"
          (change)="onInputChange($event.target.value)">
      </sam-label-wrapper>
  `,
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamNumberComponent implements ControlValueAccessor {
  /**
   * (deprecated) sets value 
   */
  @Input() value: number;
  /**
   * sets the label wrapper text
   */
  @Input() label: string;
  /**
   * sets the input name attribute value
   */
  @Input() name: string;
  /**
   * sets the minimum allowed value
   */
  @Input() min: number;
  /**
   * sets the maximum allowed value
   */
  @Input() max: number;
  /**
   * sets the hint text
   */
  @Input() hint: string;
  /**
   * deprecated, sets the error message manually
   */
  @Input() errorMessage: string;
  /**
   * sets the disabled state
   */
  @Input() disabled: boolean;
  /**
   * deprecated, toggles the required text in the label wrapper
   */
  @Input() required: boolean;
  /**
   * sets the form control to trigger label wrapper messages
   */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;

  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;
  invalidKeys = ["e",","]
  constructor(private samFormService:SamFormService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-number> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: any[] = [];

    if (this.required) {
      validators.push(Validators.required);
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

  keyDownHandler(event){
    if(this.invalidKeys.indexOf(event.key)!==-1){
      event.preventDefault();
    }
  }

  onInputChange(value) {
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
