import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  Optional,
  OnChanges,
  ChangeDetectorRef,
  TemplateRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AutocompleteConfig } from '../../types';
import { AutocompleteService } from './autocomplete.service';
import { SamFormService } from '../../form-service';

import { getKeyboardEventKey } from '../../key-event-helpers';
import { KeyHelper } from '../../utilities/key-helper/key-helper';
import { areEqual } from '../../utilities/are-equal/are-equal';

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
export class SamAutocompleteComponent
  implements ControlValueAccessor, OnChanges {
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
  @Input() public config: AutocompleteConfig =
    { keyValueConfig: { keyProperty: 'key', valueProperty: 'value'} };
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
  * Sets the general error message (For simplicity (we can enhance this it's 
  * needed): Only active when `useFormService` is false)
  */
  @Input() public errorMessage: string;
  /**
   * Emitted only when the user selects an item from the dropdown list, or when 
   * the user clicks enter and the mode is allowAny. This is useful if you do 
   * not want to respond to onChange events when the input is blurred.
   */
  @Output() public enterEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;
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
  @Input() public httpRequest: Observable<any>;

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

  public resultsAvailable: string = ' results available. Use up and down arrows\
   to scroll through results. Hit enter to select.';

  public get value(): any {
    return this.innerValue;
  }

  public set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.propogateChange(val);
    }
  }

  public keyEvents: Subject<any> = new Subject();

  public onTouchedCallback: () => void = () => null;
  public propogateChange: (_: any) => void = (_: any) => null;

  constructor(@Optional() public autocompleteService: AutocompleteService,
    private samFormService: SamFormService,
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
        if (areEqual(data, this.lastReturnedResults)) {
          data.forEach((item) => {
            this.filteredKeyValuePairs.push(item);
          });
        }
      } else {
        this.filteredKeyValuePairs = data;
      }
      const len = !!this.filteredKeyValuePairs
        ? this.filteredKeyValuePairs.length
        : 0;
      this.pushSROnlyMessage(len + this.resultsAvailable);
      this.lastReturnedResults = data;
    } else {
      if (this.results) {
        if (!areEqual(data, this.lastReturnedResults)) {
          data.forEach((item) => {
            this.results.push(item);
          });
        }
      } else {
        this.results = data;
      }
      const len = !!this.results ? this.results.length : 0;
      this.pushSROnlyMessage(len + this.resultsAvailable);
      this.lastReturnedResults = data;
    }
    this.endOfList = false;
  }

  requestError(err) {
    this.results = ['An error occurred. Try a different value.'];
    const errorobj = {};
    errorobj[this.config.keyValueConfig.keyProperty] = 'Error';
    errorobj[this.config.keyValueConfig.valueProperty] =
      'An error occurred. Try a different value.';
    this.filteredKeyValuePairs = [errorobj];
    this.hasServiceError = true;
    this.pushSROnlyMessage(this.results[0]);
  }

  ngOnInit() {
    if (!this.control) {
      return;
    }
    if (!this.useFormService) {
      this.control.statusChanges.subscribe(() => {
        setTimeout(() => {
          this.wrapper.formatErrors(this.control);
        });
      });
    } else {
      this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
        if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'submit') {
          this.wrapper.formatErrors(this.control);
        } else if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'reset') {
          this.wrapper.clearError();
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.control) {
      setTimeout(() => {
        this.wrapper.formatErrors(this.control);
      });
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
    // If event.target.name is an empty string, set search string to default 
    // search string
    const searchString = event.target.value || '';
    const keyCode = getKeyboardEventKey(event);

    if (KeyHelper.is('tab', event)) {
      return
    }

    if (KeyHelper.is('backspace', event)
      || event.key === 'Delete'
      || event.keyIdentifier === 'Delete'
      || event.code === 'Delete') {
      this.handleBackspaceKeyup();
    }

    if(!KeyHelper.is('down', event) && 
      !KeyHelper.is('up', event) &&
      event.type!=="focus"){
      this.checkLastSearch(searchString);
    }

    if (this.options) {
      this.onKeyUpWithOptions(searchString);
    } else if (this.endOfList) {
      this.onKeyUpUsingService(searchString);
    }
  }

  onKeyUpWithOptions(searchString: string) {
    if (this.isKeyValuePair(this.options)) {
      this.filteredKeyValuePairs =
        this.filterKeyValuePairs(searchString, this.options);
      this.pushSROnlyMessage(
        this.filteredKeyValuePairs.length + this.resultsAvailable
      );
    } else {
      this.results = this.filterResults(searchString, this.options);
      this.pushSROnlyMessage(this.results.length + this.resultsAvailable);
    }
  }

  onKeyUpUsingService(searchString: string) {
    let options = null;
    if (this.config) {
      options = this.config.serviceOptions || null;
    }
    if (this.autocompleteService) {
      this.autocompleteService
      .fetch(searchString, this.endOfList, options)
        .subscribe(
          (res) => this.requestSuccess(res),
          (err) => this.requestError(err),
        );
    } else if (this.httpRequest) {
      this.keyEvents.next(searchString);
    } else {
      return;
      console.error('unable to fetch search results');
    }
  }

  handleBackspaceKeyup() {
    if (!this.innerValue) {
      this.results = null;
      this.filteredKeyValuePairs = null;
    }
    if (this.inputValue === '') {
      this.value = null;
    }
  }

  checkLastSearch(searchString: string): void {
    if ((this.lastSearchedValue !== searchString) || searchString === '') {
      this.results = null;
      this.filteredKeyValuePairs = null;
      this.endOfList = true;
      this.lastSearchedValue = searchString;
    }
  }

  onKeydown(event: any) {
    this.srOnly.nativeElement.innerHTML = null;

    const list: ElementRef = this.resultsList || this.resultsListKV;

    if (list) {
      // On down arrow press
      if (KeyHelper.is('down', event)) {
        this.onDownArrowDown(list);
      }

      // On up arrow press
      if (KeyHelper.is('up', event)) {
        this.onUpArrowDown(list);
      }

      // On enter press
      if (KeyHelper.is('enter', event) && !this.hasServiceError ) {
        this.onEnterDown(list);
      }

      // ESC
      if (KeyHelper.is('esc', event)) {
        this.clearDropdown();
      }
    } else if (KeyHelper.is('enter', event) && this.allowAny ) {
      this.setSelected(this.inputValue);
    }
  }

  onDownArrowDown(list: ElementRef) {
    if (!this.listExists(list)) {
      return;
    }

    const children = list.nativeElement.children;
    let selectedChildIndex = this.getSelectedChildIndex(children);
    let message;
    let isFirstItemCategory: boolean = false;
    this.setEndOfList(selectedChildIndex, children.length);

    if (selectedChildIndex === children.length - 1) {
      this.onKeyUpUsingService(this.inputValue);
      selectedChildIndex = 
        this.checkCategoryIndex(children[selectedChildIndex]);
      // if (this.categories.length > 0 && !this.config.isCategorySelectable) {
      //   if (children[selectedChildIndex].classList.contains('category')) {
      //     isFirstItemCategory = true;
      //     selectedChildIndex++;
      //   }
      // }
     isFirstItemCategory = this.isFirstItemCategory(
        children[selectedChildIndex],
        selectedChildIndex
      );
      selectedChildIndex = selectedChildIndex
        + this.incrementIfFirstCategory(isFirstItemCategory);
      children[selectedChildIndex].classList.add('isSelected');
      this.selectedChild = children[selectedChildIndex];
      message = this.setMessage(selectedChildIndex);
    } else {
      isFirstItemCategory = this.isFirstItemCategory(
        children[selectedChildIndex + 1],
        selectedChildIndex + 1
      );
      selectedChildIndex = selectedChildIndex
        + this.incrementIfFirstCategory(isFirstItemCategory);
      children[selectedChildIndex + 1].classList.add('isSelected');
      this.selectedChild = children[selectedChildIndex + 1];
      message = this.setMessage(selectedChildIndex + 1);
    }

    this.pushSROnlyMessage(message);
    list.nativeElement.scrollTop = isFirstItemCategory
      ? this.selectedChild.offsetTop - (list.nativeElement.clientTop * 24)
      : this.selectedChild.offsetTop - list.nativeElement.clientTop;
  }

  listExists(list): boolean {
    return !list.nativeElement.children
      || !(list.nativeElement.children.length > 0)
      ? false
      : true;
  }

  incrementIfFirstCategory(isFirstCategory: boolean): number {
    return isFirstCategory ? 1 : 0;
  }

  isFirstItemCategory(item, index): boolean {
    let returnValue = false;
    if (this.categories.length > 0 && !this.config.isCategorySelectable) {
      if (item.classList.contains('category') && index === 0) {
        returnValue = true;
      }
    }
    return returnValue;
  }

  checkCategoryIndex(currentItem): number {
    let selectedChildIndex = 0;
    if (this.categories.length > 0 && !this.config.isCategorySelectable) {
      if (currentItem.classList.contains('category')) {
        // isFirstItemCategory = true;
        selectedChildIndex++;
      }
    }
    return selectedChildIndex;
  }

  setMessage(index): string {
    return !!this.results
      ? this.results[index]
      : this.filteredKeyValuePairs[index]
        [this.config.keyValueConfig.valueProperty];
  }

  onUpArrowDown(list) {
    if (!this.listExists(list)) {
      return;
    }
    const children = list.nativeElement.children;
    let selectedChildIndex = this.getSelectedChildIndex(children);
    let message;
    let isFirstItemCategory: boolean = false;


    if (this.isFirstItem(selectedChildIndex)) {
      this.endOfList = true;
      children[children.length - 1].classList.add('isSelected');
      this.selectedChild = children[children.length - 1];
      message = this.setMessage(children.length - 1);
    } else {
      if (this.categories.length > 0 && !this.config.isCategorySelectable) {

        if (selectedChildIndex !== 1
          && children[selectedChildIndex - 1].classList
          .contains('category')) {
          selectedChildIndex--;
        }

        if (selectedChildIndex === 2) {
          isFirstItemCategory = true;
        }

        if (selectedChildIndex - 1 === 0
          && children[selectedChildIndex - 1].classList
          .contains('category')) {
          this.endOfList = true;
          children[children.length - 1].classList.add('isSelected');
          this.selectedChild = children[children.length - 1];
          message = this.setMessage(children.length - 1);
          this.pushSROnlyMessage(message);
          list.nativeElement.scrollTop = this.selectedChild.offsetTop
            - list.nativeElement.clientTop;
          return;
        }
      }
      children[selectedChildIndex - 1].classList.add('isSelected');
      this.selectedChild = children[selectedChildIndex - 1];
      message = this.setMessage(selectedChildIndex - 1);
    }
    this.pushSROnlyMessage(message);
    list.nativeElement.scrollTop = this.setScrollTop(
      isFirstItemCategory,
      list
    );
  }

  isFirstItem(index): boolean {
    return index === 0 || index === -1
      ? true
      : false;
  }

  setScrollTop(isFirstItemCategory: boolean, list): number {
    return isFirstItemCategory
      ? 0
      : this.selectedChild.offsetTop - list.nativeElement.clientTop;
  }

  onEnterDown(list) {
    const children = list.nativeElement.children;
    const selectedChild = this.getSelectedChildIndex(children);

    if (selectedChild !== -1) {
      if (this.results && this.results[selectedChild]) {
        this.setSelected(this.results[selectedChild]);
      }

      if (this.filteredKeyValuePairs
        && this.filteredKeyValuePairs[selectedChild]) {
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
    const srResults: HTMLElement = document.createElement('li');
    srResults.innerText = message;
    this.srOnly.nativeElement.appendChild(srResults);
  }

  checkForFocus(event) {
    if (!this.allowAny
      && this.selectedInputValue !== this.inputValue
      && this.inputValue !== '') {
      this.inputValue = this.selectedInputValue;
    }
    if (this.inputValue === '') {
      this.results = null;
      this.filteredKeyValuePairs = null;
    }
    this.hasFocus = false;
    this.srOnly.nativeElement.innerHTML = null;
  }

  setSelected(value: any) {
    if (this.config && this.config.categoryProperty
      && !this.config.isCategorySelectable
      && this.isCategory(value)) {
      return;
    }
    let displayValue = value;
    if (this.config && this.config.keyValueConfig
      && value[this.config.keyValueConfig.valueProperty]) {
      displayValue = value[this.config.keyValueConfig.valueProperty];
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
    if (!Array.isArray(reducedArr)) {
      reducedArr = [];
    }
    return reducedArr;
  }

  filterKeyValuePairs(subStr: string, keyValuePairs: any): any {
    const lowerSubStr = subStr.toLowerCase();
    const categories = [];
    let currentCategory = '';
    const reducedArr = keyValuePairs.reduce((prev, curr, index, arr) => {
      if (curr[this.config.keyValueConfig.keyProperty]
            .toLowerCase().includes(lowerSubStr)
          || curr[this.config.keyValueConfig.valueProperty]
            .toLowerCase().includes(lowerSubStr)) {
        /**
         * Check if the current item in the array contains the substring value 
         * in either the key or value property provided on the config input
         */
        if (curr[this.config.categoryProperty] && currentCategory
          !== curr[this.config.categoryProperty]) {
          /**
           * Checks if the current item in the array has a category. If so, 
           * checks to see if this category is the current category. If not, it 
           * will push it to the returned array. If it is the current category, 
           * it skips.
           */
          currentCategory = curr[this.config.categoryProperty];
          const filteredCategories = this.categories.filter((category) => {
            /**
             * Filters the category input array property for a matching 
             * category property.
             */
            if (category[this.config.keyValueConfig.keyProperty] 
              === curr[this.config.categoryProperty]) {
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

  clearDropdown() {
    this.input.nativeElement.blur();
    this.hasFocus = false;
    this.srOnly.nativeElement.innerHTML = null;
  }

  inputFocusHandler(evt) {
    this.onTouchedCallback();
    this.hasFocus = true;
    this.onKeyup(evt);
    return evt;
  }

  clearInput() {
    if (!this.inputValue) {
      return;
    }
    this.filteredKeyValuePairs = null;
    this.results = null;
    this.input.nativeElement.value = '';
    this.innerValue = '';
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
      this.inputValue = value && this.config && this.config.keyValueConfig
        ? this.inputValue = value[this.config.keyValueConfig.valueProperty]
        : this.inputValue = value;
      this.selectedInputValue = this.inputValue;
      this.innerValue = value;
      // angular isn't populating this
      this.input.nativeElement.value = this.inputValue; 
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

  private setEndOfList(index, length) {
    if (index === length - 2) {
      this.endOfList = true;
    }
  }
}
