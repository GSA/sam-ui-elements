import { Component, Input, Output, ViewChild, EventEmitter  } from '@angular/core';
import { OptionsType } from '../../types';

/**
 * The <samMultiSelect> component is a multi-select/options group compliant
 */
@Component({
  selector: 'samMultiSelect',
  templateUrl: 'multiselect.template.html'
})
export class SamMultiSelectComponent {
  @ViewChild('select') selectElRef;
  /**
  * the array of checkbox values and labels (see OptionsType)
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
  * Sets the general component error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the disabled attribute status
  */
  @Input() disabled:boolean;
  selectedValues = [];
  constructor() { console.clear(); }
  ngAfterViewInit() {
    this.updateSelectList();
  }
  updateSelectList() {
    let options = this.selectElRef.nativeElement.options;
    for(let i=0; i < options.length; i++) {
      options[i].selected = this.selectedValues.indexOf(options[i].value) > -1;
    }
  }
  change(options) {
    this.selectedValues = Array.apply(null,options)  // convert to real Array
      .filter(option => option.selected)
      .map(option => option.value);
  }

}
