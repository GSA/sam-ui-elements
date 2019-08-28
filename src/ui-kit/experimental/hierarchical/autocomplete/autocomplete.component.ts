import { Component, Input, ViewChild, TemplateRef, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';
import { SamHierarchicalAutocompleteConfiguration } from '../models/SamHierarchicalAutocompleteConfiguration';
const Hierarchical_Autocomplete_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamHierarchicalAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [Hierarchical_Autocomplete_VALUE_ACCESSOR]
})
export class SamHierarchicalAutocompleteComponent implements ControlValueAccessor {

  /**
   * Ul list of elements 
   */
  @ViewChild('resultsList') resultsListElement: ElementRef;

  /**
   * input control 
   */
  @ViewChild('input') input: ElementRef;

  /**
   * Screen read field
   */
  @ViewChild('srOnly') srOnly: ElementRef;

  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;

  /**
   * The data model that has the selected item
   */
  public model: HierarchicalTreeSelectedItemModel;

  /**
   * Configuration for the Autocomplete control 
   */
  @Input()
  public configuration: SamHierarchicalAutocompleteConfiguration;

  /**
   * Instance of the SamHiercarchicalServiceInterface provided
   */
  @Input()
  public service: SamHiercarchicalServiceInterface;

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
  private highlightedIndex: number = 0;

  /**
   * highlighted object in drop down
   */
  private highlightedItem: object;

  /**
   * value of the input field 
   */
  public inputValue: string = '';

  /**
   * Proprty being set on the object is highlighted
   */
  private HighlightedPropertyName = 'highlighted';

  /**
   * Search string
   */
  private searchString: string = null;

  /**
   * Stored Event for ControlValueAccessor
   */
  private onTouchedCallback: () => void = () => null;

  /**
   * Stored Event for ControlValueAccessor
   */
  private propogateChange: (_: any) => void = (_: any) => null;

  @Input()
  public disabled: boolean;

  private resultsAvailableMessage: string = ' results available. Use up and down arrows\
  to scroll through results. Hit enter to select.';

  /**
   * Determines if the dropdown should be shown
   */
  public showResults = false;

  /**
   * Clears the input fields and value
   */
  public clearInput(): void {
    this.inputValue = '';
    this.onTouchedCallback();
    this.clearAndHideResults();
  }

  /**
   * 
   * @param event 
   */
  checkForFocus(event): void {
    this.focusRemoved();
    this.showResults = false;
  }

  /**
   * 
   */
  private focusRemoved() {
    if (this.model.treeMode === TreeMode.SINGLE) {
      if (this.model.getItems().length > 0) {
        if (this.inputValue.length === 0) {
          this.model.clearItems();
          this.propogateChange(this.model);
        } else {
          this.inputValue = this.model.getItems()[0][this.configuration.primaryTextField];
        }
      } else {
        this.inputValue = '';
      }
    } else {
      this.inputValue = '';
    }
  }


  textChange(event) {
    const searchString = event || '';
    this.getResults(searchString);
  }

  /**
   * Event method used when focus is gained to the input
   */
  inputFocusHandler(): void {
    this.getResults(this.inputValue || '');
    this.onTouchedCallback();
  }

  /**
   * Key event
   * @param event 
   */
  onKeydown(event): void {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    }
    else if (KeyHelper.is(KEYS.DOWN, event)) {
      this.onArrowDown();
    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      this.onArrowUp();
    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {
      this.selectItem(this.highlightedItem);
    }
    else if (KeyHelper.is(KEYS.ESC, event)) {
      this.clearAndHideResults();
    }
  }

  /**
   * selects the item adding it to the model and closes the results
   * @param item 
   */
  public selectItem(item: object): void {
    this.model.addItem(item, this.configuration.primaryKeyField);
    this.propogateChange(this.model);
    let message = item[this.configuration.primaryTextField];
    this.inputValue = message;
    if (this.configuration.secondaryTextField && item[this.configuration.secondaryTextField]) {
      message += ': ' + item[this.configuration.secondaryTextField];
    }
    message += ' selected';
    this.addScreenReaderMessage(message);
    this.focusRemoved();
    this.showResults = false;
  }

  /**
   *  clears the results and closes result drop down
   */
  private clearAndHideResults(): void {
    this.results = [];
    this.showResults = false;
    this.focusRemoved();
  }

  /**
   *  handles the arrow up key event
   */
  private onArrowUp(): void {
    if (this.results && this.results.length > 0) {
      if (this.highlightedIndex !== 0) {
        this.highlightedIndex--;
        this.setHighlightedItem(this.results[this.highlightedIndex]);
        this.scrollSelectedItemToTop();
      }
    }
  }

  /**
   *  handles the arrow down key event
   */
  private onArrowDown(): void {
    if (this.results && this.results.length > 0) {
      if (this.highlightedIndex < this.results.length - 1) {
        this.highlightedIndex++;
        this.setHighlightedItem(this.results[this.highlightedIndex]);
        this.scrollSelectedItemToTop();
      }
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
              foundItem = item[this.configuration.primaryTextField] === this.inputValue;
            }
          }
          if (this.model.getItems().length > 0 && !foundItem) {
            for (var i = 0; i < this.model.getItems().length && !foundItem; i++) {
              let item = this.model.getItems()[i];
              foundItem = item[this.configuration.primaryTextField] === this.inputValue;
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

  private createFreeTextItem() {
    let item = { 'type': 'custom' };
    item[this.configuration.primaryTextField] = this.inputValue;
    item[this.configuration.primaryKeyField] = this.inputValue;
    return item;
  }

  /**
   *  gets the inital results
   * @param searchString 
   */
  private getResults(searchString: string): void {
    if (searchString.length >= this.configuration.minimumCharacterCountSearch) {
      if (!this.matchPastSearchString(searchString) ||
        (this.matchPastSearchString(searchString) && !this.showResults)
        || this.matchPastSearchString('')) {
        this.searchString = searchString;
        window.clearTimeout(this.timeoutNumber);
        this.timeoutNumber = window.setTimeout(() => {
          this.service.getDataByText(0, searchString).subscribe(
            (result) => {
              this.results = result.items;
              if (this.showFreeText()) {
                this.results.unshift(this.createFreeTextItem());
              }
              this.maxResults = result.totalItems;
              this.highlightedIndex = 0;
              this.setHighlightedItem(this.results[this.highlightedIndex]);
              this.showResults = true;
              this.addScreenReaderMessage(this.maxResults + ' ' + this.resultsAvailableMessage)
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
   * highlights the index being hovered
   * @param index 
   */
  listItemHover(index: number): void {
    this.highlightedIndex = index;
    this.setHighlightedItem(this.results[this.highlightedIndex]);
  }

  /**
   * Scroll Event Handler (Calculates if mpre items should be asked for from service on scrolling down)
   */
  onScroll() {
    if (this.maxResults > this.results.length) {
      let scrollAreaHeight = this.resultsListElement.nativeElement.offsetHeight;
      let scrollTopPos = this.resultsListElement.nativeElement.scrollTop;
      let scrollAreaMaxHeight = this.resultsListElement.nativeElement.scrollHeight;
      if ((scrollTopPos + scrollAreaHeight * 2) >= scrollAreaMaxHeight) {
        this.getAdditionalResults();
      }
    }
  }

  /**
   * gets more results based when scrolling and adds the items
   */
  private getAdditionalResults() {
    this.service.getDataByText(this.results.length, this.searchString).subscribe(
      (result) => {
        for (let i = 0; i < result.items.length; i++) {
          this.addResult(result.items[i]);
        }
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
   * When paging up and down with arrow key it sets the highlighted item into view
   */
  private scrollSelectedItemToTop() {
    let selectedChild = this.resultsListElement.nativeElement.children[this.highlightedIndex];
    this.resultsListElement.nativeElement.scrollTop = selectedChild.offsetTop;
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
      this.highlightedItem = item;
      this.highlightedItem[this.HighlightedPropertyName] = true;
      let message = item[this.configuration.primaryTextField];
      if (this.configuration.secondaryTextField && item[this.configuration.secondaryTextField]) {
        message += ': ' + item[this.configuration.secondaryTextField]

      }
      this.addScreenReaderMessage(message);
    }
  }

  /**
   * Adds message to be read by screen reader
   * @param message 
   */
  private addScreenReaderMessage(message: string) {
    const srResults: HTMLElement = document.createElement('li');
    srResults.innerText = message;
    if (this.srOnly && this.srOnly.nativeElement) {
      this.srOnly.nativeElement.appendChild(srResults);
    }
  }


  writeValue(obj: any): void {
    if (obj instanceof HierarchicalTreeSelectedItemModel) {
      this.model = obj as HierarchicalTreeSelectedItemModel;
    }
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
