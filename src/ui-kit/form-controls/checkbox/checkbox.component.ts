import { Component, forwardRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl,ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';

/**
 * The <samCheckbox> component is a set of checkboxes 
 */
@Component({
  selector: 'samCheckbox',
  templateUrl: 'checkbox.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamCheckboxComponent),
    multi: true
  }]
})
export class SamCheckboxComponent implements ControlValueAccessor {
  /**
  * Sets the bound value of the component
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
  * Event emitted when the model value changes
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  /*
   * We want our model to list the checked items in the order that they appear in the options list
   * This object allows us to efficiently determine if a value is before another value
   */
  private _ordering: any = {};
  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };
  get value() {
    return this.model;
  }

  set value(val) {
    if(!Array.isArray(val)){
      val = [];
    }
    this.model = val;
    this.onChange(val);
    this.onTouched();
  }
  
  constructor() {}

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samCheckbox> requires a [name] parameter for 508 compliance");
    }

    // initialize the order lookup map
    for (let i = 0; i < this.options.length; i++) {
      let val = this.options[i].value;
      this._ordering[val] = i;
    }

    if(!this.control){
      return;
    }

    this.control.valueChanges.subscribe(this.onChange);

    this.wrapper.formatErrors(this.control);
  }

  // Give the check all label a name for screen readers
  checkAllLabelName() {
    return `all-${this.label}`;
  }

  isChecked(value) {
    return this.model.indexOf(value) !== -1;
  }

  onCheckChanged(value, isChecked) {
    if(this.control){
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.writeValue(this.model.filter(val => val !== value));
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      let thisOrder = this._ordering[value];
      while (i < this.model.length) {
        let otherValue = this.model[i];
        // If the item being inserted is after the current value, break and insert it
        if (thisOrder <= this._ordering[otherValue]){
          break;
        }
        i++;
      }
      let clone = this.model.slice(0);
      clone.splice(i, 0, value);
      this.writeValue(clone);
    }
    this.emitModel();
  }

  onSelectAllChange(isSelectAllChecked) {
    if(this.control){
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    if (!isSelectAllChecked) {
      this.writeValue([]);
    } else {
      this.writeValue(this.options.map(option => option.value));
    }
    this.emitModel();
  }
  
  emitModel(){
    if(this.control){
      this.control.setValue(this.model);
    }
    this.modelChange.emit(this.model);
  }
  
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    //todo
  }

  writeValue(value) {
    if(!value){
      value = [];
    }
    this.value = value;
  }
}
