import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';
import { SamFormService } from '../../form-service';

/**
 * The <sam-checkbox> component is a set of checkboxes
 */
@Component({
  selector: 'sam-checkbox',
  templateUrl: 'checkbox.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamCheckboxComponent),
    multi: true
  }]
})
export class SamCheckboxComponent implements ControlValueAccessor {
  /**
  * Deprecated, Sets the bound value of the component
  */
  @Input() model: any = [];
  /**
  * Sets the array of checkbox values and labels (see OptionsType[])
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
  * Sets helpful text for the using the component
  */
  @Input() hint: string;
  /**
  * Sets required text on component
  */
  @Input() required: boolean = false;
  /**
  * Sets the form control error message
  */
  @Input() errorMessage: string;
  /**
  * If true, an addition checkbox is added that selects all the checkboxes
  */
  @Input() hasSelectAll: boolean;
  /**
  * Sets the angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Sets disabled state
  */
  @Input() disabled: boolean;
  /**
   * Sets the id
   */
  @Input() id: string;

  public optionChange:string;

  public optionId:string;
  

  
  /**
  * Deprecated, Event emitted when the model value changes
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;
  activeOptions = 0;
  /*
   * We want our model to list the checked items in the order that they appear
   * in the options list. This object allows us to efficiently determine if a
   * value is before another value
   */
  private _ordering: any = {};

  onChange: any = (c) => undefined;

  onTouched: any = () => undefined;
  
  get value() {
    return this.model;
  }

  set value(val) {
    this.setModelValue(val);
    this.onChange(this.model);
    this.onTouched();
  }

  constructor(protected samFormService: SamFormService) {}

  ngOnInit() {
    // initialize the order lookup map
    for (let i = 0; i < this.options.length; i++) {
      const val = this.options[i].value;
      this._ordering[val] = i;
    }

    if (this.control) {
      this.control.valueChanges.subscribe(() => {
        this.wrapper.formatErrors(this.control);
      });

      this.wrapper.formatErrors(this.control);
    }
    this.setSelectAllCheck();
  }

  setModelValue(val) {
    let returnVal = val;
    if (!Array.isArray(returnVal)) {
      returnVal = [];
    }
    // don't select options that are disabled
    for (const idx in this.options) {
      const lookup = returnVal.findIndex((value) => {
        return value === this.options[idx].value;
      });
      if (this.options[idx].disabled && lookup !== -1) {
        returnVal.splice(lookup, 1);
      }
    }
    this.model = returnVal;
    this.setSelectAllCheck();
  }

  setSelectAllCheck(){
    let activeOptionsNum = 0;
    this.options.forEach(val=>{
      if(!val.disabled){
        activeOptionsNum++;
      }
    });
    this.activeOptions=activeOptionsNum;
  }

  // Give the check all label a name for screen readers
  checkAllLabelOrId() {
    let labelOrId;
    if (this.id) {
      labelOrId = `all-${this.id}`;
    } else {
      labelOrId = `all-${this.label}`;
    }
    return labelOrId;
  }

  isChecked(value) {
    return this.model.indexOf(value) !== -1;
  }

  onCheckChanged(value, isChecked, id) {
    this.onTouched();
    this.optionChange = value;
    this.optionId = id;
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.value = this.model.filter(val => val !== value);
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      const thisOrder = this._ordering[value];
      while (i < this.model.length) {
        const otherValue = this.model[i];
        // If the item being inserted is after the current value, break and
        // insert it.
        if (thisOrder <= this._ordering[otherValue]) {
          break;
        }
        i++;
      }
      const clone = this.model.indexOf('') > -1
        ? this.model.slice(1)
        : this.model.slice(0);
      clone.splice(i, 0, value);
      this.value = clone;
    }
    this.emitModel();
  }

  onSelectAllChange(isSelectAllChecked) {
    this.onTouched();
    this.value = !isSelectAllChecked
      ? []
      : this.options.map(option => option.value);
    this.emitModel();
  }

  emitModel() {

    this.modelChange.emit(this.model);
  
    this.optionSelected.emit({model : this.model, selected: this.optionChange, id: this.optionId});
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
    let returnValue = value;
    if (!returnValue) {
      returnValue = [];
    }

    this.setModelValue(returnValue);
  }
}
