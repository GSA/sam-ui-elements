import { Component, Input, Output, EventEmitter, forwardRef,
         ViewChild, ElementRef, Optional, OnChanges, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AutocompleteConfig } from '../../types';
import { AutocompleteService } from './autocomplete.service';
import {SamFormService} from '../../form-service';

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
  @ViewChild('wrapper') wrapper;

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
  * Sets the hint text
  */
  @Input() public hint: string;
  /**
  * Define autocomplete options
  */
  @Input() public options: Array<any>;
  /**
   * Allows for a configuration object
   */
  @Input() public config: AutocompleteConfig = { keyValueConfig: { keyProperty: 'key', valueProperty: 'value'} };
  /**
   * Allows any value typed in the input to be chosen
   */
  @Input() public allowAny: boolean = false;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
   * Array of categories. Applies category class if labels match values.
   */
  @Input() public categories: any = [];
  /**
  * Sets the form control
  */
  @Input() public control: FormControl;
  /**
  * Sets the required text in the label wrapper
  */
  @Input() public required: boolean;
  /**
  * Sets the general error message (For simplicity (we can enhance this it's needed): Only active when `useFormService` is false)
  */
  @Input() public errorMessage: string;
  /**
   * Emitted only when the user selects an item from the dropdown list, or when the user clicks enter and the mode is
   * allowAny. This is useful if you do not want to respond to onChange events when the input is blurred.
   */
  @Output() public enterEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;

  public results: Array<string>;
  public innerValue: any = '';
  public inputValue: any = '';
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
      this.propogateChange(val);
    }
  }

  /*
   How do define custom http callbacks:
   <sam-autocomplete
       #autoComplete
       [ngModelOptions]="{standalone: true}"
       [allowAny]="false"
       [(ngModel)]="dummySearchValue"
       [labelText]="'Find User'"
       [config]="userConfig"
       (enterEvent)="onPersonChange($event)"
       [httpRequest]="request"
   ></sam-autocomplete>

   class SomeComponent {
     @ViewChild('autoComplete') autoComplete: SamAutocompleteComponent;

     ngOnInit() {
       this.request = this.autoComplete.keyEvents
         .debounceTime(300)
         .switchMap(
          input => {
             return this.accessService.getUserAutoComplete(input)
                .catch(e => {
                  return Observable.of([]);
                });
           }
         )
         .map(
           users => {
             if (!users) {
              return [];
             }
             return users.map(user => {
              return {
                key: user.email,
                value: `${user.firstName} ${user.lastName} (${user.email })`
              };
            });
         }
       );
     }
   }
   */
  /**
   * Passes in a observable for handling when keyEvents subject triggers updates
   */
  @Input() httpRequest: Observable<any>;
  public keyEvents: Subject<any> = new Subject();

  constructor(@Optional() public autocompleteService: AutocompleteService,
    private samFormService:SamFormService,
    private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes) {
    if (changes.httpRequest) {
      this.httpRequest.subscribe(
        (res) => this.requestSuccess(res),
        (err) => this.requestError(err),
      );
    }
  }

  requestSuccess(data) {
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
  }

  requestError(err) {
    this.results = ['An error occurred. Try a different value.'];
    let errorobj = {};
    errorobj[this.config.keyValueConfig.keyProperty] = 'Error';
    errorobj[this.config.keyValueConfig.valueProperty] = 'An error occurred. Try a different value.';
    this.filteredKeyValuePairs = [errorobj];
    this.hasServiceError = true;
    this.pushSROnlyMessage(this.results[0]);
  }

  ngOnInit(){
    if(!this.control){
      return;
    }
    if (!this.useFormService) {
      this.control.statusChanges.subscribe(() => {
        setTimeout(() => {
          this.wrapper.formatErrors(this.control);
        })
      });
    }
    else {
      this.samFormService.formEventsUpdated$.subscribe(evt=>{
        if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='submit'){
          this.wrapper.formatErrors(this.control);
        } else if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='reset'){
          this.wrapper.clearError();
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.control) {
      setTimeout(() => {
        this.wrapper.formatErrors(this.control);
      })
    }
  }

  get errors() {
    return !this.useFormService ? (this.errorMessage || '') : '';
  }

  onChange() {
    if (this.allowAny) {
      this.propogateChange(this.inputValue);
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
    // If event.target.name is an empty string, set search string to default search string
    const searchString = event.target.value || '';

    if ((event.code === 'Tab' || event.keyIdentifier === 'Tab')){
      return;
    }
    if ((event.code === 'Backspace' || event.keyIdentifier === 'Backspace')
        || (event.code === 'Delete' || event.keyIdentifier === 'Delete')) {
      if (!this.innerValue) {
        this.results = null;
        this.filteredKeyValuePairs = null;
      }
      if (this.inputValue === '') {
        this.value = null;
      }
    }

    if ((this.lastSearchedValue !== searchString) || searchString==="") {
      this.results = null;
      this.filteredKeyValuePairs = null;
      this.endOfList = true;
      this.lastSearchedValue = searchString;
    }

    if (this.options && this.isKeyValuePair(this.options)) {
      this.filteredKeyValuePairs = this.filterKeyValuePairs(searchString, this.options);
      this.pushSROnlyMessage(this.filteredKeyValuePairs.length + this.resultsAvailable);
    } else if (this.options && !this.isKeyValuePair(this.options)) {
      this.results = this.filterResults(searchString, this.options);
      this.pushSROnlyMessage(this.results.length + this.resultsAvailable);
    } else if (this.endOfList) {
      let options = null;
      if (this.config) {
        options = this.config.serviceOptions || null;
      }
      if (this.autocompleteService) {
        this.autocompleteService.fetch(searchString, this.endOfList, options).subscribe(
          (res) => this.requestSuccess(res),
          (err) => this.requestError(err),
        );
      } else if (this.httpRequest) {
        this.keyEvents.next(searchString);
      } else {
        console.error('unable to fetch search results');
      }

    }
  }

  onKeydown(event: any) {
    this.srOnly.nativeElement.innerHTML = null;

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

      // ESC
      if ((event.code === 'Escape' || event.keyIdentified === 'Escape')) {
        this.clearDropdown();
      }
    } else if ((event.code === 'Enter' || event.keyIdentified === 'Enter') && this.allowAny ) {
      this.setSelected(this.inputValue);
    }
  }

  onDownArrowDown(list: ElementRef) {
    const children = list.nativeElement.children;
    let selectedChildIndex = this.getSelectedChildIndex(children);
    let message;
    let isFirstItemCategory: boolean = false;

    if (children && children.length > 0) {
      /**
       * Check if the list has children
       */
      if (selectedChildIndex === children.length - 2) {
        /**
         * If current item is second to last item in list,
         * set endOfList flag to true. This was intended
         * to be used for pagination purposes with the
         * autocomplete service.
         */
        this.endOfList = true;
      }
      if (selectedChildIndex === children.length - 1) {
        selectedChildIndex = 0;
        if (this.categories.length > 0 && !this.config.isCategorySelectable) {
          if (children[selectedChildIndex].classList.contains('category')) {
            isFirstItemCategory = true;
            selectedChildIndex++;
          }
        }
        children[selectedChildIndex].classList.add('isSelected');
        this.selectedChild = children[selectedChildIndex];
        message = !!this.results ?
                  this.results[selectedChildIndex] :
                  this.filteredKeyValuePairs[selectedChildIndex][this.config.keyValueConfig.valueProperty];
      } else {
        if (this.categories.length > 0 && !this.config.isCategorySelectable) {
          if (children[selectedChildIndex + 1].classList.contains('category')) {
            if (selectedChildIndex + 1 === 0) {
              isFirstItemCategory = true;
            }
            selectedChildIndex++;
          }
        }
        children[selectedChildIndex + 1].classList.add('isSelected');
        this.selectedChild = children[selectedChildIndex + 1];
        message = !!this.results ?
                    this.results[selectedChildIndex + 1] :
                    this.filteredKeyValuePairs[selectedChildIndex + 1][this.config.keyValueConfig.valueProperty];
      }

      this.pushSROnlyMessage(message);
      list.nativeElement.scrollTop = isFirstItemCategory ? this.selectedChild.offsetTop - (list.nativeElement.clientTop * 24) : this.selectedChild.offsetTop - list.nativeElement.clientTop;
    }
  }

  onUpArrowDown(list) {
    const children = list.nativeElement.children;
    let selectedChildIndex = this.getSelectedChildIndex(children);
    let message;
    let isFirstItemCategory: boolean = false;


    if (children && children.length > 0) {
      if (selectedChildIndex === 0 || selectedChildIndex === -1) {
        this.endOfList = true;
        children[children.length - 1].classList.add('isSelected');
        this.selectedChild = children[children.length - 1];
        message = !!this.results ?
                  this.results[children.length - 1] :
                  this.filteredKeyValuePairs[children.length -1][this.config.keyValueConfig.valueProperty];
      } else {
        if (this.categories.length > 0 && !this.config.isCategorySelectable) {
          if (selectedChildIndex !== 1 && children[selectedChildIndex - 1].classList.contains('category')) {
            selectedChildIndex--;
          }

          if (selectedChildIndex === 2) {
            isFirstItemCategory = true;
          }

          if (selectedChildIndex - 1 === 0 && children[selectedChildIndex - 1].classList.contains('category')) {
            this.endOfList = true;
            children[children.length - 1].classList.add('isSelected');
            this.selectedChild = children[children.length - 1];
            message = !!this.results ?
                      this.results[children.length - 1] :
                      this.filteredKeyValuePairs[children.length -1][this.config.keyValueConfig.valueProperty];
            this.pushSROnlyMessage(message);
            list.nativeElement.scrollTop = this.selectedChild.offsetTop - list.nativeElement.clientTop;
            return;
          }
        }
        children[selectedChildIndex - 1].classList.add('isSelected');
        this.selectedChild = children[selectedChildIndex - 1];
        message = !!this.results ?
                  this.results[selectedChildIndex - 1] :
                  this.filteredKeyValuePairs[selectedChildIndex -1][this.config.keyValueConfig.valueProperty];
      }
      this.pushSROnlyMessage(message);
      list.nativeElement.scrollTop = isFirstItemCategory ? 0 : this.selectedChild.offsetTop - list.nativeElement.clientTop;
    }
  }

  onEnterDown(list) {
    const children = list.nativeElement.children;
    const selectedChild = this.getSelectedChildIndex(children);
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

  getSelectedChildIndex(children: any): number {
    let selectedChild: number = -1;
    for (let child = 0; child < children.length; child++) {
      if (children[child].classList.contains('isSelected')) {
        selectedChild = child;
        children[child].classList.remove('isSelected');
      }
    }
    return selectedChild;
  }

  pushSROnlyMessage(message: string) {
    const srResults: HTMLElement = document.createElement("li");
    srResults.innerText = message;
    this.srOnly.nativeElement.appendChild(srResults);
  }

  checkForFocus(event) {
    if(!this.allowAny && this.selectedInputValue!=this.inputValue && this.inputValue!=""){
      this.inputValue = this.selectedInputValue;
    }
    if(this.inputValue==""){
      this.results = null;
      this.filteredKeyValuePairs = null;
    }
    this.hasFocus = false;
    this.srOnly.nativeElement.innerHTML = null;
  }

  setSelected(value: any) {
    if (this.config && this.config.categoryProperty && !this.config.isCategorySelectable && this.isCategory(value)) {
      return;
    }
    let displayValue = value;
    if(this.config && this.config.keyValueConfig && value[this.config.keyValueConfig.valueProperty]){
      displayValue = value[this.config.keyValueConfig.valueProperty]
    }
    const message = displayValue;
    this.innerValue = value;
    this.hasFocus = false;
    this.inputValue = message;
    this.input.nativeElement.value = message;
    this.selectedInputValue = this.inputValue;
    this.propogateChange(this.innerValue);
    this.srOnly.nativeElement.innerHTML = null;
    this.input.nativeElement.blur();
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
    return reducedArr;
  }

  filterKeyValuePairs(subStr: string, keyValuePairs: any): any {
    subStr = subStr.toLowerCase();
    const categories = [];
    let currentCategory = '';
    const reducedArr = keyValuePairs.reduce((prev, curr, index, arr) => {
      if (curr[this.config.keyValueConfig.keyProperty].toLowerCase().includes(subStr) ||
          curr[this.config.keyValueConfig.valueProperty].toLowerCase().includes(subStr)) {
        /**
         * Check if the current item in the array contains the substring value in
         * either the key or value property provided on the config input
         */
        if (curr[this.config.categoryProperty] && currentCategory !== curr[this.config.categoryProperty]) {
          /**
           * Checks if the current item in the array has a category. If so, checks to see if
           * this category is the current category. If not, it will push it to the returned array.
           * If it is the current category, it skips.
           */
          currentCategory = curr[this.config.categoryProperty];
          const filteredCategories = this.categories.filter((category) => {
            /**
             * Filters the category input array property for a matching category property.
             */
            if (category[this.config.keyValueConfig.keyProperty] === curr[this.config.categoryProperty]) {
              category.isCategory = true;
              return category;
            }
          });
          prev.push(filteredCategories[0]);
        }
        prev.push(curr);
      }
      return prev;
    }, []);
    return reducedArr;
  }

  clearDropdown(){
    this.input.nativeElement.blur();
    this.hasFocus = false;
    this.srOnly.nativeElement.innerHTML = null;
  }

  inputFocusHandler(evt){
    this.onTouchedCallback();
    this.hasFocus = true;
    this.onKeyup(evt);
    return evt;
  }

  clearInput(){
    if(!this.inputValue){
      return;
    }
    this.filteredKeyValuePairs = null;
    this.results = null;
    this.input.nativeElement.value = "";
    this.innerValue = "";
    this.propogateChange(null);
    this.clearDropdown();
  }

  isCategory(object: any): boolean {
    if (this.categories.indexOf(object) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      if(value && this.config && this.config.keyValueConfig){
        this.inputValue = value[this.config.keyValueConfig.valueProperty];
      } else {
        this.inputValue = value;
      }
      this.selectedInputValue = this.inputValue;
      this.innerValue = value;
      this.input.nativeElement.value = this.inputValue;//angular isn't populating this
    } else if (value === null) {
      this.inputValue = '';
      this.selectedInputValue = '';
      this.innerValue = null;
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
