import { Component, Input, Output, ViewChild, EventEmitter,forwardRef  } from '@angular/core';
import { OptionsType } from '../../types';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamListComponent),
  multi: true
};

/**
 * The <sam-list-input> component is a multi-select list component
 */
@Component({
  selector: 'sam-list-input',
  templateUrl: 'list.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamListComponent implements ControlValueAccessor {
  /**
  * the list of options a user can select from
  */
  @Input() options: OptionsType[] = [];
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
  * Sets the formControl 
  */
  @Input() control: FormControl;
  /**
  * Sets the disabled attribute status
  */
  @Input() disabled:boolean;
  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };
  selectedValues = [];
  @ViewChild(LabelWrapper) wrapper: LabelWrapper;
  constructor() {  }
  
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(selections) {
    this.selections = selections;
  }
  
  searchByLabel(text){
    return this.options.find((item)=>{
      if(item.label == text){
        return true;
      }
    });
  }
  
  searchByVal(text){
    return this.options.find((item)=>{
      if(item.value == text){
        return true;
      }
    });
  }

  onInputChange(evt){
    if(this.searchByLabel(evt)){
      let selection = this.searchByLabel(evt);
      this.errorMessage="";
      if(this.selections.indexOf(""+(selection.value)) == -1){
        this.selections.push(""+(selection.value));
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
