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
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { AutocompleteConfig } from '../../types';
import { AutocompleteService } from './autocomplete.service';
import { SamFormService } from '../../form-service';

import { KeyHelper } from '../../utilities/key-helper/key-helper';
import { areEqual } from '../../utilities/are-equal/are-equal';
import { AutocompleteCache } from '../autocomplete-multiselect/autocomplete-cache';

const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamAutocompleteComponent),
  multi: true
};

/**
 * Methods we're externally exposing
 */
export interface SamCache {
  clearCache();
}

@Component({
  selector: 'sam-autocomplete',
  templateUrl: 'autocomplete.template.html',
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class SamAutocompleteComponent
  implements ControlValueAccessor, OnChanges, OnDestroy, SamCache {
  @ViewChild('resultsList', { static: false }) resultsList: ElementRef;
  @ViewChild('resultsListKV', { static: false }) resultsListKV: ElementRef;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('srOnly', { static: true }) srOnly: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapper;

  /**
  * Sets the name attribute
  */
  @Input() public name: string;
  /**
   * Sets the tabindex attribute
   */
  @Input() public tabIndex: number = 0;
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
   * set to false if more/less is not required
   */
  @Input() public showFullHint: boolean = false;
  /**
  * Define autocomplete options
  */
  @Input() public options: Array<any>;
  /**
   * Allows for a configuration object
   */
  @Input() public config: AutocompleteConfig =
    { keyValueConfig: { keyProperty: 'key', valueProperty: 'value' } };
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
   * Emitted only when add on icon is clicked  
   */
  @Output() public addOnIconEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;
  /**
   * Set timer that keyboard input should poll to trigger service calls
   */
  @Input() public debounceTime: number = 250;

  @Input() public isFreeTextEnabled: boolean = false;

  @Input() public freeTextSubtext: string = 'search';

  @Input() public isKeyValue?: boolean;

  /**
   * Limits number of items rendered immediately for faster performance.
   * As user scrolls through list, more items are added if available.
   */
  @Input() public enableLazyRendering: boolean = false;
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
                  return of([]);
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

  // Defines how many items to initially display as well as
  // increment amount of new items as user scrolls through suggesstions
  private readonly STARTING_MAX_ITEMS = 25;

  activeDescendant: string = undefined;

  public results: Array<string> = [];
  public maxNumResultsToDisplay = this.STARTING_MAX_ITEMS;
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
  public filteredKeyValuePairs: any[] = [];
  public inputTimer;
  public cache: AutocompleteCache = new AutocompleteCache();

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

  // If lazy rendering is enabled, returns small slice of array to show to user.
  public get displayResults() {

    const arrayToCheck = this.filteredKeyValuePairs.length > 0 ? this.filteredKeyValuePairs : this.results;

    if (!this.enableLazyRendering) {
      return arrayToCheck;
    }

    const sliceIndex = arrayToCheck.length < this.maxNumResultsToDisplay ?
      arrayToCheck.length : this.maxNumResultsToDisplay;
    return arrayToCheck.slice(0, sliceIndex)
  }

  public keyEvents: Subject<any> = new Subject();

  public onTouchedCallback: () => void = () => null;
  public propogateChange: (_: any) => void = (_: any) => null;

  constructor(@Optional() public autocompleteService: AutocompleteService,
    private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) { }

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
        if (!areEqual(data, this.lastReturnedResults)) {
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
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  get errors() {
    return !this.useFormService ? (this.errorMessage || '') : '';
  }

  onChange() {
    this.textChange();
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

  freeTextAvalible(): boolean {
    if (this.isFreeTextEnabled) {
      if (this.inputValue && this.inputValue.length > 0) {
        if (this.results) {
          //Add case insensitivity?
          return this.results.indexOf(this.inputValue) === -1;
        } else if (this.filteredKeyValuePairs) {
          let foundItem = false;
          for (var i = 0; i < this.filteredKeyValuePairs.length; i++) {
            let item = this.filteredKeyValuePairs[i];
            if (item) {
              if (item[this.config.keyValueConfig.valueProperty] === this.inputValue) {
                foundItem = true;
              }
            }
          }
          return !foundItem;
        } else {
          //Exists when no other valid matches
          return true;
        }
      } else {
        //Not showing when the text string is empty
        return false;
      }
    } else {
      //Really false this feature is disabled
      return this.isFreeTextEnabled;
    }
  }

  onKeydown(event: any) {
    if (KeyHelper.is('tab', event)) {
      return
    }

    if (KeyHelper.is('backspace', event)
      || event.key === 'Delete'
      || event.keyIdentifier === 'Delete'
      || event.code === 'Delete') {
      this.handleBackspaceKeyup();
    }

    this.srOnly.nativeElement.innerHTML = null;
    const list: ElementRef = this.resultsList || this.resultsListKV;
    if (list && (KeyHelper.is('down', event) || KeyHelper.is('up', event) || (KeyHelper.is('enter', event) && !this.hasServiceError) || KeyHelper.is('esc', event))) {
      // On down arrow press
      if (KeyHelper.is('down', event)) {
        this.onDownArrowDown(list);
      }

      // On up arrow press
      if (KeyHelper.is('up', event)) {
        this.onUpArrowDown(list);
      }

      // On enter press
      if (KeyHelper.is('enter', event) && !this.hasServiceError) {
        this.onEnterDown(list);
      }

      // ESC
      if (KeyHelper.is('esc', event)) {
        this.clearDropdown();
      }
    }
    else if (KeyHelper.is('enter', event) && this.allowAny) {
      this.setSelected(this.inputValue);
    }
  }

  private textChange() {
    const searchString = this.inputValue || '';
    if (this.options) {
      this.onKeyUpWithOptions(searchString);
    }
    else if (this.autocompleteService || this.httpRequest) {
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
      window.clearTimeout(this.inputTimer);
      this.inputTimer = window.setTimeout(() => {
        this.autocompleteService
          .fetch(searchString, this.endOfList, options)
          .subscribe(
            (res) => {
              let len;
              this.hasServiceError = false;
              this.cache.insert(res, searchString);
              if (this.config && this.config.keyValueConfig) {
                this.filteredKeyValuePairs = this.cache.get(searchString);
                len = !!this.filteredKeyValuePairs
                  ? this.filteredKeyValuePairs.length
                  : 0;
              } else {
                this.results = this.cache.get(searchString);
                len = !!this.results
                  ? this.results.length
                  : 0;
              }
              this.pushSROnlyMessage(len + this.resultsAvailable);
              this.endOfList = false;
            },
            (err) => this.requestError(err),
          )
      }, this.debounceTime);
      return;
    } else if (this.httpRequest) {
      this.keyEvents.next(searchString);
    } else {
      return;
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
    this.hasFocus = true;
  }

  addOnIconClick(): void {
    this.addOnIconEvent.emit();
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
      selectedChildIndex = this.checkCategoryIndex(children[selectedChildIndex]);
      isFirstItemCategory = this.isFirstItemCategory(children[selectedChildIndex], selectedChildIndex);
      selectedChildIndex = selectedChildIndex + this.incrementIfFirstCategory(isFirstItemCategory);
      children[selectedChildIndex].classList.add('isSelected');
      this.selectedChild = children[selectedChildIndex];
      this.activeDescendant = this.selectedChild.id;
      message = this.setMessage(selectedChildIndex);
    } else {
      isFirstItemCategory = this.isFirstItemCategory(children[selectedChildIndex + 1], selectedChildIndex + 1);
      selectedChildIndex = selectedChildIndex + this.incrementIfFirstCategory(isFirstItemCategory);
      children[selectedChildIndex + 1].classList.add('isSelected');
      this.selectedChild = children[selectedChildIndex + 1];
      this.activeDescendant = this.selectedChild.id;
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
    let message = '';
    let isFirstItemFreeText = this.freeTextAvalible();
    if (index === 0 && isFirstItemFreeText) {
      message = this.inputValue + ' - ' + this.freeTextSubtext;
    }
    else if (this.results) {
      if (isFirstItemFreeText) {
        index--;
      }
      message = this.results[index]
    } else if (this.filteredKeyValuePairs) {
      if (isFirstItemFreeText) {
        index--;
      }
      message = this.filteredKeyValuePairs[index][this.config.keyValueConfig.valueProperty]
    }

    return message;
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
      let child = children[children.length - 1];
      child.classList.add('isSelected');
      this.selectedChild = child;
      this.activeDescendant = child.id;
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
          let child = children[children.length - 1];
          child.classList.add('isSelected');
          this.activeDescendant = child.id;
          this.selectedChild = child;
          message = this.setMessage(children.length - 1);
          this.pushSROnlyMessage(message);
          list.nativeElement.scrollTop = this.selectedChild.offsetTop
            - list.nativeElement.clientTop;
          return;
        }
      }
      let child = children[selectedChildIndex - 1];
      child.classList.add('isSelected');
      this.selectedChild = child;
      this.activeDescendant = child.id;
      message = this.setMessage(selectedChildIndex - 1);
    }
    this.pushSROnlyMessage(message);
    list.nativeElement.scrollTop = this.setScrollTop(
      isFirstItemCategory,
      list
    );
  }

  listItemHover(index) {
    let freeText = this.freeTextAvalible();
    if (freeText) {
      ++index;
    }
    if (index === undefined && freeText) {
      index = 0;
    }
    const list: ElementRef = this.resultsList || this.resultsListKV;
    if (!this.listExists(list)) {
      return;
    }
    const children = list.nativeElement.children;
    let selectedChildIndex = this.getSelectedChildIndex(children);
    if (selectedChildIndex !== -1 && children[selectedChildIndex]) {
      children[selectedChildIndex].classList.remove("isSelected");
    }
    if (children[index]) {
      this.selectedChild = children[index];
      this.selectedChild.classList.add('isSelected');
      if (index === children.length - 1) {
        this.endOfList = true;
        this.onKeyUpUsingService(this.inputValue ? this.inputValue : "");
      }
    }
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

    let freeText = this.freeTextAvalible();
    let selectedChild = this.getSelectedChildIndex(children);

    if (selectedChild !== -1) {

      if (freeText) {
        --selectedChild;
      }
      if (selectedChild === -1 && freeText) {
        this.setSelected(this.inputValue);
        this.input.nativeElement.focus();
      } else {
        if (this.results && this.results[selectedChild]) {
          this.setSelected(this.results[selectedChild]);
          this.input.nativeElement.focus();
        }

        if (this.filteredKeyValuePairs
          && this.filteredKeyValuePairs[selectedChild]) {
          this.setSelected(this.filteredKeyValuePairs[selectedChild]);
          this.input.nativeElement.focus();
        }
      }

    } else {
      if (this.allowAny) {
        this.setSelected(this.inputValue);
        this.input.nativeElement.focus();
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
    if (this.srOnly && this.srOnly.nativeElement) {
      this.srOnly.nativeElement.appendChild(srResults);
    }
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
    let displayValue = value ? value : '';
    if (this.config && this.config.keyValueConfig && value
      && value[this.config.keyValueConfig.valueProperty]) {
      displayValue = value[this.config.keyValueConfig.valueProperty];
    }
    const message = displayValue;
    this.innerValue = value ? value : '';
    this.hasFocus = false;
    this.inputValue = message;
    this.input.nativeElement.value = message;
    this.selectedInputValue = this.inputValue;
    this.propogateChange(this.innerValue);
    this.srOnly.nativeElement.innerHTML = null;
    this.pushSROnlyMessage(`You chose ${message}`);
    this.enterEvent.emit(value);
    this.activeDescendant = undefined;
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
    this.activeDescendant = undefined;
  }

  inputFocusHandler(evt) {
    this.onTouchedCallback();
    this.hasFocus = true;
    this.textChange();
    return evt;
  }

  clearInput() {
    if (!this.inputValue) {
      return;
    }
    this.filteredKeyValuePairs = null;
    this.results = null;
    this.inputValue = "";
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

  dropdownClick(obj) {
    this.setSelected(obj);
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.focus();
    }
    this.hasFocus = false;
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

  itemClass(obj) {
    const hasCategories = this.categories && this.categories.length;
    const notCategory = !(obj && obj.isCategory);
    return {
      category: obj && obj.isCategory,
      selectable: this.config.isCategorySelectable,
      indented: hasCategories && notCategory,
    };
  }

  freeTextClass() {
    return this.itemClass({ isCategory: false, isCategorySelectable: false })
  }


  displayFreeTextSimpleResults() {
    if (this.isKeyValue !== undefined && this.isFreeTextEnabled) {
      return !this.isKeyValue && this.freeTextAvalible();
    } else {
      return false;
    }
  }

  displayFreeTextKeyValueResults() {
    if (this.isKeyValue !== undefined && this.isFreeTextEnabled) {
      return this.isKeyValue && this.freeTextAvalible();
    } else {
      return false;
    }
  }

  /**
   * Display additional items to user as they scroll through
   * suggestions. Only valid if lazy rendering is enabled, otherwise,
   * all possible suggestions would be shown.
   */
  onScroll() {
    if (!this.enableLazyRendering) {
      return;
    }
    const element: ElementRef = this.resultsList || this.resultsListKV;
    const resultsArray = this.filteredKeyValuePairs.length > 0 ? this.filteredKeyValuePairs : this.results;
    if (this.maxNumResultsToDisplay < resultsArray.length - 1) {
      let scrollAreaHeight = element.nativeElement.offsetHeight;
      let scrollTopPos = element.nativeElement.scrollTop;
      let scrollAreaMaxHeight = element.nativeElement.scrollHeight;
      if ((scrollTopPos + scrollAreaHeight * 2) >= scrollAreaMaxHeight) {
        this.maxNumResultsToDisplay += this.STARTING_MAX_ITEMS;
      }
    }
  }

  private setEndOfList(index, length) {
    if (index === length - 2) {
      this.endOfList = true;
    }
  }

  public clearCache() {
    this.cache.clearAll();
  }
}
