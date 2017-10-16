"use strict"

import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef,
         Optional, OnChanges, OnInit, ChangeDetectorRef, AfterViewChecked, Renderer2
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AutocompleteConfig } from '../../../types';
import { AutocompleteService } from '../autocomplete.service';
import { SamFormService } from '../../../form-service';
import { ScreenReaderPusher } from './screenreader-pusher';
import * as KeyEventHelpers from '../../../key-event-helpers';
import * as TypeCheckHelpers from '../../../type-check-helpers';

const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamAutocompleteComponentRefactor),
  multi: true
};

@Component({
selector: 'sam-autocomplete-refactor',
templateUrl: 'autocomplete.template.html',
providers: [ AUTOCOMPLETE_VALUE_ACCESSOR ]
})
export class SamAutocompleteComponentRefactor implements ControlValueAccessor, OnChanges, OnInit {
  /**
   * UL list ViewChild for displaying autocomplete options
   */
  @ViewChild('list') private _list: ElementRef;

  /**
   * Text input for filtering results
   */
  @ViewChild('input') private _input: ElementRef;

  /**
   * Hidden list element with aria assertive that reads
   * items pushed into it as user interacts with component.
   */
  @ViewChild('screenReaderEl') private _screenReaderEl: ElementRef;
  /**
   * ViewChild for wrapper. Need this for our hacky label wrapper
   */
  @ViewChild('wrapper') private wrapper;

  /**
   * Provide name for input
   */
  @Input() public name: string;
  /**
   * Provide a unique id for input
   */
  @Input() public id: string;
  /**
   * Provide a label for the input
   */
  @Input() public label: string;
  /**
   * DEPRECATED: Provide a label for the input; Use label instead
   */
  @Input() public labelText: string;
  /**
   * Provide hint for labelWrapper
   */
  @Input() public hint: string;
  /**
   * Provides labelWrapper with error message to display on error
   */
  @Input() public errorMessage: string;
  /**
   * Provide placeholder for input
   */
  @Input() public placeholder: string;
  /**
   * Config oBject
   */
  @Input() public config: any;
  /**
   * If true, form validation
   * will fail if field is left blank.
   */
  @Input() public required: boolean = false;
  /**
   * Pass in a form control for labelWrapper
   */
  @Input() public control: FormControl;
  /**
   * Toggles validations to display with SamFormService events
   */
  @Input() public useFormService: boolean
  /**
   * Pass custom querying and filtering callback
   * for result
   */
  @Input() public filterCallback: (input:string, ...args) => Observable<any[]>;
  /**
   * List of options to display in list
   */
  @Input() public options: any[];
  /**
   * Categories
   */
  @Input() public categories: any[] = [];
  /**
   * Allow categories to be selected if true
   * Otherwise, users cannot select categories and
   * they are skipped when using keydown in the list
   */
  @Input() public isCategorySelectable?: boolean;
  /**
   * Allow the component to accept
   * any user input as a valid value.
   * 
   * If false, the user may only 
   * select a value from the list
   * to be set as the input value.
   */
  @Input() public allowAny: boolean = false;
  /**
   * 
   */
  @Input() public addOnIconClass: string = "fa-chevron-down";
  /**
   * Emitted only when the user selects an item from the dropdown list, or when the user clicks enter and the mode is
   * allowAny. This is useful if you do not want to respond to onChange events when the input is blurred.
   */
  @Output() public enterEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Component State Variables
   */
  @Input('disabled') private _disabled: boolean;
  /**
   * Stores value that the user has
   * selected from the input.
   * 
   * Can be a string or an object.
   * 
   * Differs from the input value in
   * that the input value is a separate
   * state variable that can be modified
   * independently from state of this
   * component.
   */
  private _value: String | any;
  /**
   * The value that comes from the input.
   * This is the value that is displayed
   * in the text input, not necessarily
   * the value that is set within
   * the autocomplete component.
   */
  private _inputValue: any;
  /**
   * Observable subscription that triggers whether or not
   * to show the list of results.s
   */
  private _displayList: any;
  /**
   * Item that is currently highlighted
   * from user input. 
   */
  private _selectedItem: any;
  /**
   * Boolean that determines whether 
   * to display a spinner while results
   * are loading
   */
  private _showSpinner: boolean;

  private _endOfList: boolean = true; // If user reaches end of list, set to true for pagination

  /**
   * Results of filter calls that are then
   * displayed on the page
   */
  private _filteredOptions: Observable<any[]>;
  /**
   * Tracks the item that is currently highlighted in the list
   */
  private _displaySpinner: boolean = false;
  private _highlightedItemIndex: number;
  private _addOnIconClass: string = "fa-chevron-down";
  private _keyValueConfig: any;
  private _serviceOptions: any;
  private _categoryProperty: string;

  private _screenreader: ScreenReaderPusher;
  private _cache: any = {};

  private _filter: (...args) => Observable<any[]>;
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = (_: any) => { };

  /**
   * RxJS Streams Setup
   */
  private _onInputEvent: Subject<any>;
  private _onInputFocus: Subject<any> = new Subject<any>();
  private _onInputKeydown: Subject<any> = new Subject<any>();
  private _onInputKeyup: Subject<any> = new Subject<any>();
  private _onInputChange: Subject<any> = new Subject<any>();
  private _onBlurEvent: Subject<any> = new Subject<any>();

  private _blurSubscription: Subscription;

  ngOnInit() {

    if (this.control) {
      if (!this.useFormService) {
        this.control.statusChanges.subscribe(() => {
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
      } else {
        this.samFormService.formEventsUpdated$.subscribe(evt => {
          if( (!evt['root'] || evt['root'] == this.control.root) && 
              evt['eventType'] &&
              evt['eventType'] == 'submit' ) {
            this.wrapper.formatErrors(this.control);
          } else if ( (!evt['root']|| evt['root']==this.control.root) &&
                      evt['eventType'] &&
                      evt['eventType'] == 'reset' ) {
            this.wrapper.clearError();
          }
        });
      }
    }

    this._filter = this._getFilterMethod();

    /**
     * Emits event from user input in text input.
     * Initialized with call to filter with an empty string
     */
    this._onInputEvent = new BehaviorSubject<any>(this._filter(''));

   /**
    * Stream of input events that filter results and push to 
    */
    this._filteredOptions =
      this._onInputEvent
      /**
       * Debounce results
       * Only emits one event every 300ms
       */
      .debounceTime(300)
      /**
       * Calls filter when event is received
       * If another event is emitted before callback finishes,
       * switchmap cancels the callback and starts again with
       * the new emitted event.
       */
      .switchMap(
       (event) => {
        this._displaySpinner = true;
         /**
          * Call filter with value from input or empty string
          * Our business rules dictate that if the input has 
          * focus, a list of results should be displayed.
          */
          const filterValue = (event && event.target && event.target.value) || '';
          let returnValue: Observable<any>;

          if (this._cache[filterValue] && this._endOfList === false) {
            this._displaySpinner = false;
            return Observable.of(this._cache[filterValue]);
          }

          return this._filter(event && event.target && event.target.value || '', this._endOfList, this._serviceOptions)
                  .map(ev => {
                    if (!this._cache[filterValue]) {
                      this._cache[filterValue] = ev;
                    } else {
                      ev.forEach(item => this._cache[filterValue].push(item));
                    }
                    this._displaySpinner = false; 
                    this._endOfList = false;
                    return this._cache[filterValue]; 
                  }) 
                  .catch(error => {
                    console.error(error);
                    return Observable.of(['No results found']);
                  });
        }
      )

      this._onInputEvent
        .subscribe(
          event => event && event.target ? this._setInputValue(event.target.value) : null,
          err => console.error(err)
        )

      this._onInputKeydown
        .subscribe(
          (event) => {
            this._onInputEvent.next(this._inputValue);                
          }
        )
    
      /**
       * Stream of keydown events from input
       * Logic handles moving through the list with the up and down arrows
       * along with setting model value on enter.
       */
      this._onInputKeyup
        .subscribe(
          (event) => {            
            let keyCode = KeyEventHelpers.getKeyboardEventKey(event);

            if (KeyEventHelpers.isArrowDownKey(keyCode)) {
              this._handleDownArrow();
            } else if (KeyEventHelpers.isArrowUpKey(keyCode)) {
              this._handleUpArrow();
            } else if (KeyEventHelpers.isEnterKey(keyCode)) {
              event.preventDefault();
              this._handleEnter(event);
            } 

          },
          (err) => console.error(err)
        )

    /**
     * Stream of events that map to boolean
     * Used to trigger displaying the options list
     */
    this._displayList = 
      this._onInputFocus
        .merge(this._onBlurEvent) // Hide list when component blurs
        .flatMap(evt => evt ? Observable.of(true) : Observable.of(false))

    /**
     * Register on touched event when input is focused
     */    
    this._onInputFocus
        .subscribe(
          (ev) => this.onTouchedCallback(),
          (err) => console.error(err)
        )
    
    /**
     * Stream of blur events
     * Resets highlighting logic for list on blur
     */
    this._blurSubscription = 
      this._onBlurEvent
        .subscribe(
          event => this._resetListHighlighting(),
          err => console.error(err)
        )
  }

  ngAfterContentInit() {
    /**
     * Instantiate screen reader pusher with Renderer2 and ViewChild UL
     * In this lifecycle because it needs a reference to the HTML element
     * once the view has been checked. 
     */
    this._screenreader = new ScreenReaderPusher(this._renderer, this._screenReaderEl.nativeElement);
  }

  /**
   * Logic to handle enter events
   * Subscribes to 
   */
  private _handleEnter(event: KeyboardEvent): void {
    this._filteredOptions
      .flatMap((item) => Observable.from(item))
      .filter((item, index) => index === this._highlightedItemIndex)
      .subscribe(
        item => this._updateComponentValue(item),
        err => console.error(err)
      )
  }

  /**
   * Logic to handle down arrow keydown event
   */
  private _handleDownArrow(): void {
    if (!this._list) return;

    let list: HTMLUListElement = this._list.nativeElement;

    this._removeSelectedClassFromListItems(list.children);

    this._highlightNextListItem(list.children, "INCREMENT");
  }

  /**
   * Logic to handle up arrow keydown event
   */
  private _handleUpArrow(): void {
    if (!this._list) return;

    let list: HTMLUListElement = this._list.nativeElement;

    this._removeSelectedClassFromListItems(list.children);

    this._highlightNextListItem(list.children, "DECREMENT");
  }

  /**
   * Takes a list and direction and highlights 
   * @param list Children of an HTMLUListElement
   * @param direction One of INCREMENT or DECREMENT
   */
  private _highlightNextListItem(list: HTMLCollection, direction: string) {
    let highlightedItem;

    switch (direction) {
      case "INCREMENT":
        this._highlightedItemIndex = this._circularIncrement(this._highlightedItemIndex, list.length);
        break;
      case "DECREMENT":
        this._highlightedItemIndex = this._circularDecrement(this._highlightedItemIndex, list.length);
        break;
      default:
        console.warn("Direction parameter in _highlightItem function must be one of INCREMENT or DECREMENT");
        return;
    }

    this._endOfList = this._highlightedItemIndex === list.length - 1 ? true : false;
    
    highlightedItem = list[this._highlightedItemIndex] as HTMLLIElement;

    if (highlightedItem) {
      this._addHighlightClass(highlightedItem);
      if (this._screenreader) this._screenreader.pushMessage(highlightedItem.innerText);

      this._list.nativeElement.scrollTop = highlightedItem.offsetTop - this._list.nativeElement.clientTop;      
    }

    return;    
  }

  /**
   * Reset highlighted item index and removed selected class
   */
  private _resetListHighlighting(): void {
    // Blur input
    this._input.nativeElement.blur();

    // Hide spinner
    this._displaySpinner = false;
    
    // Set input value back to display text for input 
    if (!this.allowAny) this._setInputValue(this._displayOptionText(this._value));

    
    this._highlightedItemIndex = null;    
    if (this._list) this._removeSelectedClassFromListItems(this._list.nativeElement.children);
  }

  /**
   * Removes selected class from all items in list
   */
  private _removeSelectedClassFromListItems(list: HTMLCollection): void {
    if (!list) return;
    Array.prototype.forEach.call(list, (li: HTMLLIElement) => {
      this._removeHighlightClass(li);
    });
  }

  /**
   * Add class selected to list item
   */
  private _addHighlightClass(li: HTMLLIElement): void {
    if (!li) return;
    return li.classList.add('highlight');
  }

  /**
   * Remove class selected from list itme
   */
  private _removeHighlightClass(li: HTMLLIElement): void {
    if (!li) return;
    return li.classList.remove('highlight');
  }

  /**
   * Takes an index and a length
   * Increments the number up to its length,
   * but returns 0 if the index is the length
   * 
   * Returns 0 if null.
   */
  private _circularIncrement(index: number, length: number): number {
    let returnIndex: number;
    if (index === null || index === undefined || index === length-1) {
      returnIndex = 0;
    } else {
      returnIndex = index + 1;
    }

    if (!this.isCategorySelectable &&
        ( this._list &&
          this._list.nativeElement &&
          this._list.nativeElement.children &&
          this._list.nativeElement.children[returnIndex] &&
          this._list.nativeElement.children[returnIndex].classList &&
          this._list.nativeElement.children[returnIndex].classList.value.includes('category') )) {
        
       return this._circularIncrement(returnIndex, length);
    } else {
      return returnIndex;
    }
  }

  /**
   * Takes an index and a length.
   * Decrements the number until reaching zero,
   * then returns length.
   * 
   * Returns length if null.
   */
  private _circularDecrement(index: number, length: number): number {
    let returnIndex: number;
    if (!index || index === 0) {
      returnIndex = length - 1;
    } else {
      returnIndex = index - 1;
    }

    if (!this.isCategorySelectable &&
        ( this._list &&
          this._list.nativeElement &&
          this._list.nativeElement.children &&
          this._list.nativeElement.children[returnIndex] &&
          this._list.nativeElement.children[returnIndex].classList &&
          this._list.nativeElement.children[returnIndex].classList.value.includes('category') )) {
      
      return this._circularDecrement(returnIndex, length);
    } else {
      return returnIndex;
    }
  }

  /**
   * If input has focus, return true
   */
  private _displayClearButton?(): boolean {
    return (this._inputValue || this._value);
  }

  /**
   * Returns string representing option's value
   * after determining the type of option
   */
  private _displayOptionText(option: any): string {
    if (TypeCheckHelpers.isString(option)) {
      return option;
    } else if (TypeCheckHelpers.isObject(option)) {
      return option[this.config.keyValueConfig.valueProperty];
    } else {
      return '';
    }
  }

  /**
   * Determine which method to use to get items in list
   * Precedence: filterCallback > autocomplete service > built-in filter
   */
  private _getFilterMethod(): (...args) => Observable<any[]> {
    let service: (...args) => any;
    service = this._service && this._service.fetch ? this._service.fetch : null;
    if (this.filterCallback) {
      return this.filterCallback;
    } else if (service) {
      return service.bind(this._service);
    } else {
      return this._getSimpleFilter();
    }
  }

  /**
   * Checks for type of options that are passed in
   * and returns the correct filter function for
   * the correct data type.
   */
  private _getSimpleFilter(): (...args) => Observable<any[]> {
    return this._isArrayOfStrings(this.options) ? this._stringFilter : this._objectsFilter;
  }

  /**
   * Returns true if all array items are strings
   */
  private _isArrayOfStrings(array: any[]): boolean {
    return array.reduce((bool: boolean, item: any) => {
      if (!TypeCheckHelpers.isString(item)) bool = false;
      return bool;
    }, true);
  }

  /**
   * Returns an array of filtered options
   * where each option contains the passed
   * value as a substring.
   */
  private _stringFilter(value: string): Observable<any[]> {
    value = value.toLowerCase();
    return Observable.of(this.options.filter(item => item.toLowerCase().includes(value)));
  }
  
  /**
   * Returns an array of filtered options of key/value pairs where each
   * option contains the value as a substring either of the key or 
   * the value.
   * 
   * Contains logic to sorting by category as well
   */
  private _objectsFilter(value: string): Observable<any[]> {
    value = value.toLowerCase();
    const categories = [];
    let currentCategory = '';
    return Observable.of(this.options.reduce((prev, curr, index, arr) => {
      if (curr[this.config.keyValueConfig.keyProperty].toLowerCase().includes(value) ||
          curr[this.config.keyValueConfig.valueProperty].toLowerCase().includes(value)) {
        /**
         * If item has a category and the item's category is not the stored current category,
         * 
         */
        if (curr[this.config.keyValueConfig.categoryProperty] && (currentCategory !== curr[this.config.keyValueConfig.categoryProperty])) {
          /**
           * Checks if the current item in the array has a category. If so, checks to see if
           * this category is the current category. If not, it will push it to the returned array.
           * If it is the current category, it skips.
           */
          currentCategory = curr[this.config.keyValueConfig.categoryProperty];
          const filteredCategories = this.categories.filter((category) => {
            /**
             * Filters the category input array property for a matching category property.
             */
            if (category[this.config.keyValueConfig.keyProperty] === curr[this.config.keyValueConfig.categoryProperty]) {
              category.isCategory = true;
              return category;
            }
          });
          prev.push(filteredCategories[0]);
        }
        prev.push(curr);
      }
      return prev;
    }, []));
  }

  constructor(@Optional() private _service: AutocompleteService,
              private _cdr: ChangeDetectorRef,
              private _renderer: Renderer2,
              private samFormService: SamFormService) {}

  ngOnChanges() {}

  /**
   * Takes any number of functions 
   * and returns a function that is
   * the composition of the passed
   * functions.
   */
  pipe(...functions): any {
    return function (data) {
      return functions.reduce((value, func) => func(value), data)
    }
  }

  /**
   * Given a value, update the state
   */
  private _updateComponentValue(value: any): void {
    /**
     * Don't take any action if item is a category
     * and isCategorySelectable flag set to false or ignored
     */
    if (!this.isCategorySelectable) {
      if (this.categories && this.categories.indexOf(value) !== -1) {
        return
      }
    }

    /**
     * Create pipeline to update value and modify ui variables
     */
    const composedUpdate =
      this.pipe(
        this._setValue.bind(this),
        this._displayOptionText.bind(this),
        this._setInputValue.bind(this),
        this._screenreader ? this._screenreader.pushMessage.bind(this._screenreader) : _ => _,
        this._resetListHighlighting.bind(this),
        this._onBlurEvent.next.bind(this._onBlurEvent),        
      );

    composedUpdate(value);

    return;
  }

  private _clearComponent(): void {
    return this._updateComponentValue('');
  } 

  /**
   * Sets the value internally in the component
   */
  private _setValue<T>(value: T): T {
    this._value = value;
    this.onChangeCallback(this._value);
    return this._value;
  }

  /**
   * 
   */
  private _setInputValue(value: string): string {
    this._inputValue = value;
    if (this.allowAny || value === "") this._value = this._inputValue;
    return value;
  }

  /**
   * ControlValueAccessor Logic
   */
  writeValue(value: any): void {
    this._updateComponentValue(value);
  }

  registerOnChange(fn: (...args) => any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: (...args) => any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
  }
}
