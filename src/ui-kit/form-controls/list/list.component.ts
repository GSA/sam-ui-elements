import { Component, Input, Output, ViewChild, EventEmitter,forwardRef,OnInit,OnChanges  } from '@angular/core';
import { OptionsType } from '../../types';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";

export const LIST_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamListComponent),
  multi: true
};

/**
 * The <sam-list-input> component is a list multi-select component
 */
@Component({
  selector: 'sam-list-input',
  templateUrl: 'list.template.html',
  providers: [ LIST_VALUE_ACCESSOR ]
})
export class SamListComponent implements ControlValueAccessor,OnInit,OnChanges {
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
  @Input() required:boolean;
  /**
  * Sets the disabled attribute status
  */
  @Input() disabled:boolean;
  @ViewChild('textinput') textinput;
  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };
  selectedValues = [];
  textValue = "";
  autocompleteOptions: string[];
  resetIconClass:string = "usa-agency-picker-search-reset";
  @ViewChild(LabelWrapper) wrapper: LabelWrapper;
  constructor() {  }
  ngOnChanges(){
    if(this.options){
      this.autocompleteOptions = <string[]>this.options.map((item)=>{
        return <string>item.label;
      });
    }
  }

  ngOnInit(){
    if (!this.control) {
      return;
    }
    
    let validators: any[] = [];

    if (this.required) {
      validators.push(Validators.required);
    }

    this.control.setValidators(validators);
    this.control.valueChanges.subscribe(this.onChange);

    this.wrapper.formatErrors(this.control);
  }
  textInputChange(evt){
    if(evt.length>0){
      this.resetIconClass = "usa-agency-picker-search-reset-active";
    } else {
      this.resetIconClass = "usa-agency-picker-search-reset";
    }
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

  writeValue(selections) {
    if(!selections){
      selections = [];
    }
    if(!Array.isArray(selections)){
      console.error("provided selections is not an array", selections);
      return;
    }
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
    if(this.control){
      this.control.markAsDirty();
    }
    this.textinput.clearDropdown();
    if(this.searchByLabel(evt)){
      let selection = this.searchByLabel(evt);
      this.errorMessage="";
      if(this.selections.indexOf(""+(selection.value)) == -1){
        this.selections.push(""+(selection.value));
      }
    } else if(evt && evt['length'] && evt.length==0) {
      this.errorMessage="";
    } else {
      this.errorMessage="Not a valid selection";
    }
    this.onTouched(()=>{});
    this.onChange(this.selections); 
  }
  
  removeItem(idx){
    if(this.control) {
      this.control.markAsDirty();
    }
    this.selections.splice(idx,1);
    this.onTouched(()=>{});
    this.onChange(this.selections);
  }
  onResetClick(){
    this.resetIconClass = "usa-agency-picker-search-reset";
    this.textValue = "";
  }
  autocompleteSelect(selection){
    this.onInputChange(selection);
  }
}
