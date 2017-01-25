import { Component, Input, Output, ViewChild, EventEmitter  } from '@angular/core';
import { OptionsType } from '../../types';

/**
 * The <samMultiSelect> component is a multi-select/options group compliant
 *
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - Sets the label text
 * @Input name: string - Sets the semantic description for the component
 * @Input hint: string - Sets the helpful text for the using the component
 * @Input errorMessage: string - Sets the general component error message
 * @Input disabled: boolean - Sets the disabled attribute status
 *
 */
@Component({
  selector: 'samMultiSelect',
  templateUrl: 'multiselect.template.html'
})
export class SamMultiSelectComponent {
  @ViewChild('select') selectElRef;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
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
