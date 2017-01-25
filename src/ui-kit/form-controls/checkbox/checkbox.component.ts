import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';

/**
 * The <samCheckbox> component is a set of checkboxes 
 *
 * @Input model - Sets the bound value of the component
 * @Input options: [{Option}] - Sets the array of checkbox values and labels (see OptionsType)
 * @Input label: string - Sets the content of <label>
 * @Input name: string - Sets the semantic description for the component
 * @Input hint: string - Sets helpful text for the using the component
 * @Input errorMessage: string - Sets the form control error message
 * @Input hasSelectAll: boolean - If true, an addition checkbox is added that selects all the checkboxes
 * @Output modelChange: any - Event emitted when the model value changes
 */
@Component({
  selector: 'samCheckbox',
  templateUrl: 'checkbox.template.html',
})
export class SamCheckboxComponent {
  @Input() model: any = [];
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() hasSelectAll: boolean;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  /*
   * We want our model to list the checked items in the order that they appear in the options list
   * This object allows us to efficiently determine if a value is before another value
   */
  private _ordering: any = {};

  constructor() { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samCheckbox> requires a [name] parameter for 508 compliance");
    }

    // initialize the order lookup map
    for (let i = 0; i < this.options.length; i++) {
      let val = this.options[i].value;
      this._ordering[val] = i;
    }
  }

  // Give the check all label a name for screen readers
  checkAllLabelName() {
    return `all-${this.label}`;
  }

  isChecked(value) {
    return this.model.indexOf(value) !== -1;
  }

  onCheckChanged(value, isChecked) {
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.model = this.model.filter(val => val !== value);
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
      this.model.splice(i, 0, value);
    }
    this.modelChange.emit(this.model);
  }

  onSelectAllChange(isSelectAllChecked) {
    if (!isSelectAllChecked) {
      this.model = [];
    } else {
      this.model = this.options.map(option => option.value);
    }
    this.modelChange.emit(this.model);
  }
}
