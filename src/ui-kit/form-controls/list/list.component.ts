import { Component, Input, Output, ViewChild, EventEmitter  } from '@angular/core';
import { OptionsType } from '../../types';

/**
 * The <sam-list-input> component is a multi-select list component
 */
@Component({
  selector: 'sam-list-input',
  templateUrl: 'list.template.html'
})
export class SamListComponent {
  /**
  * the list of options a user can select from
  */
  @Input() options: string[] = [];
  /**
  * the active selections
  */
  @Input() selections: string[] = [];
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
  constructor() {  }
  ngAfterViewInit() {
    //add code to inject service if provided
  }

  onInputChange(evt){
    if(this.options.indexOf(evt) > -1){
      let idx = this.options.indexOf(evt);
      this.errorMessage="";
      if(this.selections.indexOf(this.options[idx]) == -1){
        this.selections.push(this.options[idx]);
      }
    } else if(evt.length==0) {
      this.errorMessage="";
    } else {
      this.errorMessage="Not a valid selection";
    }
  }
  
  removeItem(idx){
    this.selections.splice(idx,1);
  }
}
