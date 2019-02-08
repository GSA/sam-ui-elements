import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import {SamFormService} from '../../form-service';

/**
 * The <sam-radio-button> component is a set of checkboxes compliant with
 * sam.gov standards
 */
@Component({
  selector: 'sam-radio-button',
  templateUrl: 'radiobutton.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamRadioButtonComponent),
    multi: true
  }]
})
export class SamRadioButtonComponent  {
  /**
  * Sets the bound value of the component
  */
  @Input() public model: string|number|symbol;
  /**
  * Sets the array of checkbox values and labels (see OptionsType)
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
  * Sets the helpful text for the using the component
  */
  @Input() public hint: string;
  /**
  * Sets required text on component
  */
  @Input() public required: boolean = false;
  /**
  * Sets the general error message
  */
  @Input() public errorMessage: string;
  /**
  * Sets the angular FormControl
  */
  @Input() public control: FormControl;
  /**
  * Event emitted when model value changes
  */
  @Output() public modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper) public wrapper: FieldsetWrapper;

  public disabled = undefined;


  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    if (!this.name) {
      throw new Error('<sam-radio-button> requires a [name]\
       parameter for 508 compliance');
    }

    if (!this.control) {
      return;
    }
  }

  public ngAfterViewInit() {
    this.control.valueChanges.subscribe(() => {
      this.wrapper.formatErrors(this.control);
    });

    this.wrapper.formatErrors(this.control);
    this.cdr.detectChanges();
  }

  public onRadioChange(value) {
    this.model = value;
    this.onChange(value);
    this.modelChange.emit(value);
  }

  public onChange: any = () => undefined;
  public onTouched: any = () => undefined;

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
    this.model = value;
  }
}
