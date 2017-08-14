import {Component, Input, ViewChild, forwardRef} from '@angular/core';
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
        <input type="number" [attr.min]="min ? min : null" [attr.max]="max ? max : null" [value]="value" [attr.id]="name" [disabled]="disabled" (change)="onInputChange($event.target.value)">
      </sam-label-wrapper>
  `,
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamNumberComponent implements ControlValueAccessor {
  @Input() value: number;
  @Input() label: string;
  @Input() name: string;
  @Input() min: number;
  @Input() max: number;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() control: FormControl;
  @Input() maxlength: number;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;

  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor(private samFormService:SamFormService) { }

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
