import { Component, Input, Output, EventEmitter, forwardRef,
         ViewChild, Renderer, ElementRef, Optional, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';

import { AutocompleteConfig } from '../../types';

import { AutocompleteService } from './autocomplete.service';


const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'sam-autocomplete',
  templateUrl: 'autocomplete.template.html',
  providers: [ AUTOCOMPLETE_VALUE_ACCESSOR ]
})
export class SamAutocompleteComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('resultsList') resultsList: ElementRef;
  @ViewChild('resultsListKV') resultsListKV: ElementRef;
  @ViewChild('input') input: ElementRef;
  @ViewChild('srOnly') srOnly: ElementRef;

  /**
  * Sets the name attribute
  */
  @Input() public name: string;
  /**
  * Sets the id attribute
  */
  @Input() public id: string;
  /**
  * Sets the label text
  */
  @Input() public labelText: string;
  /**
  * Define autocomplete options
  */
  @Input() public options: Array<any>;
  /**
  * Display a clear button for the text input
  */
  @Input() public showClearButton: boolean = false;
  /**
   * Allows for a configuration object
   */
  @Input() public config: AutocompleteConfig;
  /**
   * Allows any value typed in the input to be chosen
   */
  @Input() public allowAny: boolean = false;

  /**
   * Emitted only when the user selects an item from the dropdown list, or when the user clicks enter and the mode is
   * allowAny. This is useful if you do not want to respond to onChange events when the input is blurred.
   */
  @Output() public enterEvent: EventEmitter<any> = new EventEmitter();

  public results: Array<string>;
  public innerValue: any = '';
  public inputValue: any;
  public selectedInputValue: any;
  public selectedChild: HTMLElement;
  public hasFocus: boolean = false;
  public hasServiceError: boolean = false;

  public endOfList: boolean = true;
  public lastSearchedValue: string;

  public lastReturnedResults: Array<string>;

  public keyValuePairs: any;
  public filteredKeyValuePairs: any;

  public resultsAvailable: string = ' results available. Use up and down arrows to scroll through results. Hit enter to select.';

  public onTouchedCallback: () => void = () => {};
  public propogateChange: (_: any) => void = (_: any) => { };

  get value(): any {
    return this.innerValue;
  }

  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.propogateChange(JSON.stringify(val));
    }
  }

  constructor(@Optional() public autocompleteService: AutocompleteService, public renderer: Renderer) {}

  ngOnChanges() {

  }

  onChange() {
    if (this.allowAny) {
      this.propogateChange(this.inputValue);
    } else {
      this.propogateChange(this.innerValue);
    }
  }

  isKeyValuePair(arr: Array<any>): boolean {
    if (arr && arr[0] && typeof arr[0] !== 'string') {
      return true;
    } else {
      return false;
    }
  }

  onKeyup(event: any) {
    if ((event.code === 'Backspace' || event.keyIdentifier === 'Backspace') && !this.innerValue) {
      this.results = null;
      this.filteredKeyValuePairs = null;
    }

    if ((this.lastSearchedValue !== event.target.value) && (event.target.value !== '')) {
      this.results = null;
      this.filteredKeyValuePairs = null;
      this.endOfList = true;
      this.lastSearchedValue = event.target.value;
    }

    if (this.options && this.isKeyValuePair(this.options)) {
      this.filteredKeyValuePairs = this.filterKeyValuePairs(event.target.value, this.options);
      this.pushSROnlyMessage(this.filteredKeyValuePairs.length + this.resultsAvailable);
    } else if (this.options && !this.isKeyValuePair(this.options)) {
      this.results = this.filterResults(event.target.value, this.options);
      this.pushSROnlyMessage(this.results.length + this.resultsAvailable);
    } else if (this.endOfList) {
      let options = null;
      if (this.config) {
        options = this.config.serviceOptions || null;
      }
      this.autocompleteService.fetch(event.target.value, this.endOfList, options).subscribe(
        (data) => {
          this.hasServiceError = false;
          if (this.isKeyValuePair(data)) {
            if (this.filteredKeyValuePairs) {
              const currentResults = data.forEach((item) => {
                return item[this.config.keyValueConfig.keyProperty];
              });
              if (JSON.stringify(currentResults) !== JSON.stringify(this.lastReturnedResults)) {
                data.forEach((item) => {
                  this.filteredKeyValuePairs.push(item);
                });
              }
            } else {
              this.filteredKeyValuePairs = data;
            }
            let len = !!this.filteredKeyValuePairs ? this.filteredKeyValuePairs.length : 0;
            this.pushSROnlyMessage(len + this.resultsAvailable);
            this.lastReturnedResults = data.forEach((item) => {
              return item[this.config.keyValueConfig.keyProperty];
            });
          } else {
            if (this.results) {
              if (data.toString() !== this.lastReturnedResults.toString()) {
                data.forEach((item) => {
                  this.results.push(item);
                });
              }
            } else {
              this.results = data;
            }
            let len = !!this.results ? this.results.length : 0;
            this.pushSROnlyMessage(len + this.resultsAvailable);
            this.lastReturnedResults = data;
          }
          this.endOfList = false;
        },
        (err) => {
          this.results = ['An error occurred. Try a different value.'];
          this.filteredKeyValuePairs = [{key: 'Error', value: 'An error occurred. Try a different value.'}];
          this.hasServiceError = true;
          this.pushSROnlyMessage(this.results[0]);
        }
      );
    }
  }

  onKeydown(event: any) {
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);

    const list: ElementRef = this.resultsList || this.resultsListKV;

    if (list) {

      // On down arrow press
      if (event.code === 'ArrowDown' || event.keyIdentifier === 'Down') {
        this.onDownArrowDown(list);
      }

      // On up arrow press
      if (event.code === 'ArrowUp' || event.keyIdentifier === 'Up') {
        this.onUpArrowDown(list);
      }

      // On enter press
      if ((event.code === 'Enter' || event.keyIdentified === 'Enter') && !this.hasServiceError ){
        this.onEnterDown(list);
      }

      //ESC
      if ((event.code === 'Escape' || event.keyIdentified === 'Escape') && (this.results && this.results.length > 0) && !this.hasServiceError) {
        this.clearDropdown();
      }
    } else if ((event.code === 'Enter' || event.keyIdentified === 'Enter') && this.allowAny ) {
      this.setSelected(this.inputValue);
    }
  }

  onDownArrowDown(list: ElementRef) {
    const children = list.nativeElement.children;
    const selectedChild = this.getSelectedChild(children);
    let message;

    if (children && children.length > 0) {
      if (selectedChild === children.length - 2) {
        this.endOfList = true;
      }
      if (selectedChild === children.length - 1) {
        this.renderer.setElementClass(children[0], 'isSelected', true);
        this.selectedChild = children[0];
        message = !!this.results ?
                  this.results[0] :
                  this.filteredKeyValuePairs[0][this.config.keyValueConfig.valueProperty];
      } else {
        this.renderer.setElementClass(children[selectedChild + 1], 'isSelected', true);
        this.selectedChild = children[selectedChild + 1];
        message = !!this.results ?
                    this.results[selectedChild + 1] :
                    this.filteredKeyValuePairs[selectedChild + 1][this.config.keyValueConfig.valueProperty];
      }

      this.pushSROnlyMessage(message);
      this.renderer.setElementProperty(list.nativeElement, 'scrollTop',
                                       this.selectedChild.offsetTop - list.nativeElement.clientTop)
    }
  }

  onUpArrowDown(list) {
    const children = list.nativeElement.children;
    const selectedChild = this.getSelectedChild(children);
    let message;

    if (children && children.length > 0) {
      if (selectedChild === 0 || selectedChild === -1) {
        this.endOfList = true;
        this.renderer.setElementClass(children[children.length - 1], 'isSelected', true);
        this.selectedChild = children[children.length - 1];
        message = !!this.results ?
                  this.results[children.length - 1] :
                  this.filteredKeyValuePairs[children.length -1][this.config.keyValueConfig.valueProperty];
      } else {
        this.renderer.setElementClass(children[selectedChild - 1], 'isSelected', true);
        this.selectedChild = children[selectedChild - 1];
        message = !!this.results ?
                  this.results[selectedChild - 1] :
                  this.filteredKeyValuePairs[selectedChild -1][this.config.keyValueConfig.valueProperty];
      }
      this.pushSROnlyMessage(message);
      this.renderer.setElementProperty(list.nativeElement,
                                       'scrollTop',
                                       this.selectedChild.offsetTop - list.nativeElement.clientTop)
    }
  }

  onEnterDown(list) {
    const children = list.nativeElement.children;
    const selectedChild = this.getSelectedChild(children);
    let message;

    if (selectedChild !== -1) {
      if (this.results && this.results[selectedChild]) {
        this.setSelected(this.results[selectedChild]);
      }

      if (this.filteredKeyValuePairs && this.filteredKeyValuePairs[selectedChild]) {
        this.setSelected(this.filteredKeyValuePairs[selectedChild]);
      }
    } else {
      if (this.allowAny) {
        this.setSelected(this.inputValue);
      }
    }
  }

  getSelectedChild(children: any) {
    let selectedChild: number = -1;
    for (let child = 0; child < children.length; child++) {
      if (children[child].className.includes('isSelected')) {
        selectedChild = child;
        children[child].className = '';
      }
    }
    return selectedChild;
  }

  pushSROnlyMessage(message: string) {
    const srResults: HTMLElement = this.renderer.createElement(this.srOnly.nativeElement, 'li');
    this.renderer.setElementProperty(srResults, 'innerText', message);
    this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [srResults]);
  }

  checkForFocus(event) {
    if(!this.allowAny && this.selectedInputValue!=this.inputValue){
      this.inputValue = "";
    }
    this.hasFocus = false;
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
  }

  setSelected(value: any) {
    let displayValue = value;
    if(this.config && this.config.keyValueConfig && value[this.config.keyValueConfig.valueProperty]){
      displayValue = value[this.config.keyValueConfig.valueProperty]
    }
    const message = displayValue;
    this.innerValue = value;
    this.hasFocus = false;
    this.inputValue = message;
    this.selectedInputValue = this.inputValue;
    this.propogateChange(this.innerValue);
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
    this.renderer.invokeElementMethod(this.input.nativeElement, 'blur', []);
    this.pushSROnlyMessage(`You chose ${message}`);
    this.enterEvent.emit(value);
  }

  filterResults(subStr: string, stringArray: Array<string>): Array<string> {
    let reducedArr = stringArray.filter((str) => {
      if (str.toLowerCase().includes(subStr.toLowerCase())) {
        return str;
      }
    });
    if(!Array.isArray(reducedArr)){
      reducedArr = [];
    }
    if(this.config && this.config.dropdownLimit && reducedArr.length > this.config.dropdownLimit){
      reducedArr.length = this.config.dropdownLimit
    }
    return reducedArr;
  }

  filterKeyValuePairs(subStr: string, keyValuePairs: any): any {
    subStr = subStr.toLowerCase();
    let reducedArr = keyValuePairs.reduce((prev, curr, index, arr) => {
      if (curr[this.config.keyValueConfig.keyProperty].toLowerCase().includes(subStr) ||
          curr[this.config.keyValueConfig.valueProperty].toLowerCase().includes(subStr)) {
        prev.push(curr);
      }
      return prev;
    }, []);
    if(this.config && this.config.dropdownLimit && reducedArr.length > this.config.dropdownLimit){
      reducedArr.length = this.config.dropdownLimit;
    }
    return reducedArr;
  }

  clearDropdown(){
    this.renderer.invokeElementMethod(this.input.nativeElement, 'blur', []);
    this.hasFocus = false;
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
  }

  inputFocusHandler(evt){
    this.hasFocus = true;
    if(evt.target.value){
      this.onKeyup(evt);
    }
  }

  clearInput(){
    this.filteredKeyValuePairs = null;
    this.results = null;
    this.input.nativeElement.value = "";
    this.propogateChange(null);
    this.clearDropdown();
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      if(value && this.config && this.config.keyValueConfig){
        this.inputValue = value[this.config.keyValueConfig.valueProperty];
      } else {
        this.inputValue = value;
      }
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.input.nativeElement.disabled = isDisabled;
  }
}
