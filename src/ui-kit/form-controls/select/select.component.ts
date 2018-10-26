import {
  Component,
  Input,
  Output,
  ChangeDetectorRef,
  Optional,
  ViewChild,
  EventEmitter,
  forwardRef,
  AfterViewInit
} from '@angular/core';
import { LabelWrapper } from '../../wrappers';
import { OptionsType } from '../../types';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import {SamFormService} from '../../form-service';

const noop = () => undefined;
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
  @Input() public model: string|number|symbol;
  /**
  * Sets the array of option values and text (see OptionsType)
  */
  @Input() public options: OptionsType[];
  /**
  * Sets the label text
  */
  @Input() public label: string;
  /**
  * Sets the semantic description for the component
  */
  @Input() public name: string;
  /**
  * Sets the aria label attribute for the component
  */
  @Input() public ariaLabel: string;
  /**
   * Sets the tabindex attribute value
   */
  @Input() public tabIndex: number = 0;
  /**
  * Sets the helpful text for the using the component
  */
  @Input() public hint: string;
  /**
  * Sets the general error message
  */
  @Input() public errorMessage: string;
  /**
  * Sets the general error message
  */
  @Input() public required: boolean;
  /**
  * Sets the general error message
  */
  @Input() public disabled: boolean;
  /**
  * Sets the general error message
  */
  @Input() public control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() public useFormService: boolean;
  /**
  * Event emitted on modal value change
  */
  @Output() public modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper) public wrapper: LabelWrapper;

  @ViewChild('select') public select: any;

  private onChange: (_: any) => void;
  private onTouched: () => void;

  constructor(@Optional() private cdr: ChangeDetectorRef,
    private samFormService: SamFormService) { }

  ngOnInit() {
    if(!this.ariaLabel){
      this.ariaLabel = this.name; 
    }
    if (!this.name) {
      throw new Error('<sam-select> requires a [name]\
       parameter for 508 compliance');
    }

    if (!this.control) {
      return;
    }

    if (this.control) {
      if (!this.useFormService) {
        this.control.statusChanges.subscribe(() => {
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
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
  }

  ngAfterViewInit() {
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
}
