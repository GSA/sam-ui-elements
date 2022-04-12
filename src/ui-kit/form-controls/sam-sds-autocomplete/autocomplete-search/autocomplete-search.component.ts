import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  ElementRef,
  forwardRef,
  ChangeDetectorRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { SAMSDSAutocompleteServiceInterface } from "./models/SAMSDSAutocompleteServiceInterface";
import { KeyHelper, KEYS } from "../../../utilities/key-helper/key-helper";
import { SAMSDSSelectedItemModel } from "../selected-result/models/sds-selectedItem.model";
import {
  SelectionMode,
  SAMSDSSelectedItemModelHelper,
} from "../selected-result/models/sds-selected-item-model-helper";
import { SAMSDSAutocompleteSearchConfiguration } from "./models/SAMSDSAutocompleteConfiguration";
import { faSquare, faCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

const Autocomplete_Autocomplete_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SAMSDSAutocompleteSearchComponent),
  multi: true,
};

@Component({
  selector: "sam-sds-search-autocomplete",
  templateUrl: "./autocomplete-search.component.html",
  styleUrls: ["./autocomplete-search.component.scss"],
  providers: [Autocomplete_Autocomplete_VALUE_ACCESSOR],
})
export class SAMSDSAutocompleteSearchComponent implements ControlValueAccessor {
  /** Icons */
  faSquare = faSquare;
  faCircle = faCircle;
  faTimes = faTimes;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}
  /**
   * Ul list of elements
   */
  @ViewChild("resultsList", { static: false }) resultsListElement: ElementRef;

  /**
   * input control
   */
  @ViewChild("input", { static: true }) input: ElementRef;

  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;

  /**
   * The data model that has the selected item
   */
  public model: SAMSDSSelectedItemModel;

  /**
   * Model contain only the primary key, primary value, and secondary value.
   */
  @Input() public essentialModelFields: boolean = false;

  /**
   * Configuration for the Autocomplete control
   */
  @Input()
  public configuration: SAMSDSAutocompleteSearchConfiguration;

  /**
   * Instance of the SamHiercarchicalServiceInterface provided
   */
  @Input()
  public service: SAMSDSAutocompleteServiceInterface;

  /**
   * Timer id for the timer awaiting the service call for more typeing
   */
  private timeoutNumber: number;

  /**
   *  result set to be rendered
   */
  results: object[];

  /**
   * max number of results to be shown
   */
  private maxResults: number;

  /**
   * selected index
   */
  public highlightedIndex: number = 0;

  /**
   * selected child index
   */
  public highlightedChildIndex = 0;

  /**
   * highlighted object in drop down
   */
  private highlightedItem: object;

  /**
   * value of the input field
   */
  public inputValue: string = "";

  /**
   * Proprty being set on the object is highlighted
   */
  private HighlightedPropertyName = "highlighted";

  public showLoad: boolean = true;

  /**
   * Search string
   */
  private searchString: string = null;

  /**
   * Message announced by screen readers when
   * autocomplete results are updated or new item
   * is highlighted
   */
  public srOnlyText: string;

  /**
   * To make input readonly
   */
  @Input() public inputReadOnly = false;

  public isItemSelected: boolean = false;

  /**
   * Stored Event for ControlValueAccessor
   */
  public onTouchedCallback: () => void = () => null;

  /**
   * Stored Event for ControlValueAccessor
   */
  public propogateChange: (_: any) => void = (_: any) => null;

  @Input()
  public disabled: boolean;

  private resultsAvailableMessage: string =
    " results available. Use up and down arrows\
  to scroll through results. Hit enter to select.";

  private index = 0;
  /**
   * Gets the string value from the specifed properties of an object
   * @param object
   * @param propertyFields comma seperated list with periods depth of object
   */

  getObjectValue(object: Object, propertyFields: string): string {
    let value = "";
    let current = object;
    let fieldSplit = propertyFields.split(",");
    for (let i = 0; i < fieldSplit.length; i++) {
      let fieldValue = fieldSplit[i];
      let fieldPartSplit = fieldValue.split(".");
      for (let j = 0; j < fieldPartSplit.length; j++) {
        let fieldCheckValue = fieldPartSplit[j];
        if (current) {
          current = current[fieldCheckValue];
        }
      }

      if (current) {
        value += current.toString() + " ";
      }
      current = object;
    }
    return value.trim();
  }

  /**
   * Determines if the dropdown should be shown
   */
  public showResults = false;

  /**
   * Clears the input fields and value
   */
  public clearInput(): void {
    this.inputValue = "";
    this.onTouchedCallback();
    this.clearAndHideResults();
    this.updateSingleModeFocusOutModel();
  }

  /**
   *
   * @param event
   */
  checkForFocus(event): void {
    if (this.configuration) {
      if (
        this.configuration.isTagModeEnabled ||
        this.configuration.isFreeTextEnabled
      ) {
        this.focusRemoved();
      } else {
        if (this.model.items.length <= 0) {
          this.inputValue = "";
          this.input.nativeElement.value = "";
        }
      }
    }

    this.showResults = false;
  }
  updateSingleModeFocusOutModel() {
    if (this.configuration) {
      if (this.configuration.selectionMode === SelectionMode.SINGLE)
        SAMSDSSelectedItemModelHelper.clearItems(this.model);
      this.propogateChange(this.model);
    }
  }

  clickOutSide(event): void {
    this.focusRemoved();
    this.showResults = false;
  }

  /**
   *
   */
  private focusRemoved() {
    if (this.inputValue) {
      setTimeout(() => {
        if (this.configuration) {
          if (this.configuration.selectionMode === SelectionMode.SINGLE) {
            const val = this.inputValue;
            if (
              this.configuration.isTagModeEnabled ||
              this.configuration.isFreeTextEnabled
            ) {
              if (
                SAMSDSSelectedItemModelHelper.containsItem(
                  val[this.configuration.primaryKeyField],
                  this.configuration.primaryKeyField,
                  this.model.items
                )
              ) {
                SAMSDSSelectedItemModelHelper.clearItems(this.model);
                this.propogateChange(this.model);
                this.selectItem(this.createFreeTextItem(val));
              } else if (this.model.items.length <= 0) {
                this.selectItem(this.createFreeTextItem(val));
              }
            }
          } else if (
            this.configuration.selectionMode === SelectionMode.MULTIPLE
          ) {
            if (
              this.configuration.isFreeTextEnabled ||
              this.configuration.isTagModeEnabled
            ) {
              if (this.configuration.isDelimiterEnabled) {
                this.updateDelimeterModel();

                this.inputValue = "";
                this.input.nativeElement.value = "";
              } else {
                const val = this.inputValue;
                this.selectItem(this.createFreeTextItem(val));
                this.inputValue = "";
                this.input.nativeElement.value = "";
              }
            } else {
              this.inputValue = "";
              this.input.nativeElement.value = "";
            }
          }
        }
      }, 150);
    }
  }

  onkeypress(ev) {
    return this.configuration.inputReadOnly ? false : true;
  }
  textChange(event) {
    if (!this.configuration.isTagModeEnabled) {
      // ie 11 placeholders will incorrectly trigger input events (known bug)
      // if input isn't active element then don't do anything
      if (event.target != document.activeElement) {
        event.preventDefault();
        return;
      }
      const searchString = event.target.value || "";
      this.getResults(searchString);
    }
  }

  /**
   * Event method used when focus is gained to the input
   */
  inputFocusHandler(): void {
    if (!this.configuration.isTagModeEnabled) {
      if (this.configuration.focusInSearch) {
        this.highlightedIndex = 0;
        this.highlightedChildIndex = this.configuration.isSelectableGroup
          ? 0
          : null;
        this.getResults(this.inputValue || "");
      }
      this.onTouchedCallback();
    }
  }

  /**
   * Key event
   * @param event
   */
  onKeydown(event): void {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    } else if (KeyHelper.is(KEYS.BACKSPACE, event)) {
      if (this.configuration.inputReadOnly) {
        event.preventDefault();
      }
    } else if (KeyHelper.is(KEYS.DOWN, event)) {
      this.onArrowGroupDown();
    } else if (KeyHelper.is(KEYS.UP, event)) {
      event.preventDefault();
      this.onArrowGroupUp();
    } else if (KeyHelper.is(KEYS.ENTER, event) && this.highlightedIndex >= 0) {
      if (this.configuration.isTagModeEnabled) {
        if (
          this.configuration.selectionMode === SelectionMode.MULTIPLE &&
          this.configuration.isDelimiterEnabled
        ) {
          this.updateDelimeterModel();
        } else {
          const val = this.createFreeTextItem(this.inputValue);
          this.selectItem(val);
        }
      } else {
        this.selectItem(this.highlightedItem);
      }
    } else if (KeyHelper.is(KEYS.ENTER, event) && this.highlightedIndex < 0) {
      if (this.configuration.isFreeTextEnabled) {
        if (
          this.configuration.selectionMode === SelectionMode.MULTIPLE &&
          this.configuration.isDelimiterEnabled
        ) {
          this.updateDelimeterModel();
        } else {
          const val = this.createFreeTextItem(this.inputValue);
          this.selectItem(val);
        }
      }
    } else if (KeyHelper.is(KEYS.ESC, event)) {
      if (this.showResults) {
        this.clearAndHideResults();
        if (event.stopPropagation) {
          event.stopPropagation();
        }
      }
    }
  }

  getSeparatedValue() {
    let values;
    if (Array.isArray(this.configuration.delimiters)) {
      values = this.inputValue.split(
        new RegExp("[" + this.configuration.delimiters.join("") + "]", "g")
      );
    } else {
      values = this.inputValue.split(",");
    }
    return values;
  }

  updateDelimeterModel() {
    let separatedValues = this.getSeparatedValue();
    for (let i in separatedValues) {
      if (separatedValues[i]) {
        const val = this.createFreeTextItem(separatedValues[i].trim());
        this.selectItem(val);
      }
    }
  }
  /**
   * selects the item adding it to the model and closes the results
   * @param item
   */
  public selectItem(item: object): void {
    this.isItemSelected = true;
    let filterItem = {};
    if (this.essentialModelFields) {
      filterItem[this.configuration.primaryKeyField] =
        item[this.configuration.primaryKeyField];
      filterItem[this.configuration.primaryTextField] =
        item[this.configuration.primaryTextField];
      if (this.configuration.secondaryTextField) {
        filterItem[this.configuration.secondaryTextField] =
          item[this.configuration.secondaryTextField];
      }
    } else {
      filterItem = item;
    }
    SAMSDSSelectedItemModelHelper.addItem(
      filterItem,
      this.configuration.primaryKeyField,
      this.configuration.selectionMode,
      this.model
    );
    this.propogateChange(this.model);
    let message = this.getObjectValue(
      item,
      this.configuration.primaryTextField
    );
    this.inputValue = message;
    // this.focusRemoved();
    this.showResults = false;
    if (this.configuration.selectionMode === SelectionMode.MULTIPLE) {
      this.inputValue = "";
      this.input.nativeElement.value = "";
    }
  }

  /**
   *  clears the results and closes result drop down
   */
  private clearAndHideResults(): void {
    this.results = [];
    this.showResults = false;
    this.focusRemoved();
  }

  openOptions() {
    this.input.nativeElement.focus();
  }

  public getFlatElements() {
    const results = this.results;
    const flat = [];
    const flatten = (array: any) => {
      for (let i in array) {
        const item = array[i];
        flat.push(item);
        if (
          item[this.configuration.groupByChild] &&
          item[this.configuration.groupByChild].length
        ) {
          flatten(item[this.configuration.groupByChild]);
        }
      }
    };
    flatten(results);
    return flat;
  }
  /**
   * When paging up and down with arrow key it sets the highlighted item into view
   */
  private scrollToSelectedItem() {
    if (this.highlightedIndex >= 0) {
      let selectedChild;
      const dom = this.resultsListElement.nativeElement;
      selectedChild = dom.querySelector(".sds-autocomplete__item--highlighted");
      if (selectedChild) {
        selectedChild.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  }
  /**
   *  handles the arrow down key event
   */
  private onArrowGroupDown(): void {
    if (this.results && this.results.length > 0) {
      const flat = this.getFlatElements();
      if (this.highlightedIndex < this.results.length - 1) {
        this.highlightedIndex++;
      }
      this.setHighlightedItem(flat[this.highlightedIndex]);
      this.scrollToSelectedItem();
    }
  }
  /**
   *  handles the arrow up key event
   */
  private onArrowGroupUp(): void {
    if (this.results && this.results.length > 0) {
      const flat = this.getFlatElements();
      if (this.highlightedIndex != 0) {
        this.highlightedIndex--;
      }
      this.setHighlightedItem(flat[this.highlightedIndex]);
      this.scrollToSelectedItem();
    }
  }
  showFreeText() {
    if (this.configuration.isFreeTextEnabled) {
      if (this.inputValue) {
        if (this.inputValue.length !== 0) {
          let foundItem = false;
          if (this.results) {
            for (var i = 0; i < this.results.length && !foundItem; i++) {
              let item = this.results[i];
              foundItem =
                item[this.configuration.primaryTextField] === this.inputValue;
            }
          }
          if (this.model.items.length > 0 && !foundItem) {
            for (var i = 0; i < this.model.items.length && !foundItem; i++) {
              let item = this.model.items[i];
              foundItem =
                item[this.configuration.primaryTextField] === this.inputValue;
            }
          }

          return !foundItem;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return this.configuration.isFreeTextEnabled;
    }
  }

  private createFreeTextItem(value) {
    let item = { type: "custom" };
    item[this.configuration.primaryTextField] = value;
    item[this.configuration.primaryKeyField] = value;
    return item;
  }
  /**
   *  return Item is already selected or not
   * @param result
   */
  checkItemSelected(result: any) {
    const selectedItem = this.model.items.filter(
      (item) =>
        item[this.configuration.primaryKeyField] ===
        result[this.configuration.primaryKeyField]
    );
    return selectedItem.length > 0 ? true : false;
  }
  /**
   *  gets the inital results
   * @param searchString
   */
  private getResults(searchString: string): void {
    if (searchString.length >= this.configuration.minimumCharacterCountSearch) {
      if (
        !this.matchPastSearchString(searchString) ||
        (this.matchPastSearchString(searchString) && !this.showResults) ||
        this.matchPastSearchString("")
      ) {
        this.searchString = searchString;
        window.clearTimeout(this.timeoutNumber);
        this.timeoutNumber = window.setTimeout(() => {
          this.showLoad = true;
          this.service.getDataByText(0, searchString).subscribe((result) => {
            this.results = result.items;
            this.showLoad = false;
            this.maxResults = result.totalItems;

            this.highlightedIndex =
              this.configuration.isFreeTextEnabled || this.maxResults == 0
                ? -1
                : 0;
            if (!this.configuration.isFreeTextEnabled) {
              this.setHighlightedItem(this.results[this.highlightedIndex]);
            }
            this.showResults = true;
            this.addScreenReaderMessage(
              this.maxResults + " " + this.resultsAvailableMessage
            );
            this._changeDetectorRef.markForCheck();
          });
        }, this.configuration.debounceTime);
      }
    }
  }

  /**
   * Checks if the new search string matches the old search string
   * @param searchString
   */
  private matchPastSearchString(searchString: string) {
    return this.searchString === searchString;
  }
  /**
   * Scroll Event Handler (Calculates if mpre items should be asked for from service on scrolling down)
   */
  onScroll() {
    if (this.maxResults > this.results.length) {
      let scrollAreaHeight = this.resultsListElement.nativeElement.offsetHeight;
      let scrollTopPos = this.resultsListElement.nativeElement.scrollTop;
      let scrollAreaMaxHeight = this.resultsListElement.nativeElement
        .scrollHeight;
      if (scrollTopPos + scrollAreaHeight * 2 >= scrollAreaMaxHeight) {
        this.getAdditionalResults();
      }
    }
  }

  /**
   * gets more results based when scrolling and adds the items
   */
  private getAdditionalResults() {
    this.showLoad = true;
    this.service
      .getDataByText(this.results.length, this.searchString)
      .subscribe((result) => {
        for (let i = 0; i < result.items.length; i++) {
          this.addResult(result.items[i]);
        }
        this.showLoad = false;
        this.maxResults = result.totalItems;
      });
  }

  /**
   * adds a single item to the list
   * @param item
   */
  private addResult(item: object) {
    //add check to make sure item does not exist
    this.results.push(item);
  }

  /**
   * Sets the highlighted item by keyboard or mouseover
   * @param item
   */
  private setHighlightedItem(item: Object): void {
    if (this.results && this.results.length > 0) {
      if (this.highlightedItem) {
        this.highlightedItem[this.HighlightedPropertyName] = false;
      }
      let message = "";
      if (item) {
        this.highlightedItem = item;
        this.highlightedItem[this.HighlightedPropertyName] = true;
        message = item[this.configuration.primaryTextField];
        if (
          this.configuration.secondaryTextField &&
          item[this.configuration.secondaryTextField]
        ) {
          message += ": " + item[this.configuration.secondaryTextField];
        }
      } else {
        this.highlightedItem = undefined;
        message = "No item selected";
      }
      this.addScreenReaderMessage(message);
    }
  }

  /**
   * Adds message to be read by screen reader
   * @param message
   */
  private addScreenReaderMessage(message: string) {
    this.srOnlyText = message;
  }

  writeValue(obj: any): void {
    if (obj instanceof SAMSDSSelectedItemModel) {
      this.model = obj as SAMSDSSelectedItemModel;
      this._changeDetectorRef.markForCheck();
      if (this.model.items.length === 0) {
        this.inputValue = "";
      } else {
        if (this.configuration.selectionMode === SelectionMode.SINGLE) {
          this.inputValue = this.getObjectValue(
            this.model.items[0],
            this.configuration.primaryTextField
          );
        }
      }
    }
  }
  getClass() {
    return this.configuration.inputReadOnly &&
      this.configuration.selectionMode === SelectionMode.MULTIPLE
      ? "hide-cursor"
      : "";
  }

  registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
