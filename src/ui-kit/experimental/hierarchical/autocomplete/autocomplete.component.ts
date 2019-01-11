import {
  Component, Input, ViewChild, TemplateRef,
  ElementRef
} from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';


@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class SamHierarchicalAutocompleteComponent {

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
  @Input()
  public model: HierarchicalTreeSelectedItemModel;

  /**
   * Settings for the Autocomplete control 
   */
  @Input()
  public settings: SamHierarchicalAutocompleteSettings;

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
  public inputValue: string;

  /**
   * Proprty being set on the object is highlighted
   */
  private HighlightedPropertyName = 'highlighted';

  /**
   * Search string
   */
  private searchString: string = null;


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
    this.clearAndHideResults();
  }

  /**
   * 
   * @param event 
   */
  checkForFocus(event): void {
    this.showResults = false;
  }

  /**
   * Event method used when focus is gained to the input
   */
  inputFocusHandler(): void {
    this.getResults(this.inputValue || '');
  }

  /**
   * Key event
   * @param event 
   */
  onKeyup(event): void {
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
    else if (KeyHelper.is(KEYS.BACKSPACE, event) || KeyHelper.is(KEYS.DELETE, event)) {
      const searchString = event.target.value || '';
      this.getResults(searchString);
    }
    else {
      const searchString = event.target.value || '';
      this.getResults(searchString);
    }
  }

  /**
   * selects the item adding it to the model and closes the results
   * @param item 
   */
  private selectItem(item: object): void {
    this.model.addItem(item, this.settings.keyField);

    let message = item[this.settings.valueProperty];
    if (this.settings.subValueProperty && item[this.settings.subValueProperty]) {
      message += ': ' + item[this.settings.subValueProperty]

    }
    message += ' selected';
    this.addScreenReaderMessage(message);
    this.showResults = false;
    if (this.model.treeMode === TreeMode.SINGLE) {
      this.inputValue = item[this.settings.valueProperty]
    }
  }


  /**
   *  clears the results and closes result drop down
   */
  private clearAndHideResults(): void {
    this.results = [];
    this.showResults = false;

    if (this.model.treeMode === TreeMode.SINGLE) {
      if (this.model.getItems().length > 0) {
        if (this.inputValue.length === 0) {
          this.model.clearItems();
        } else {
          this.inputValue = this.model.getItems()[0][this.settings.valueProperty]
        }
      }
    }
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

  /**
   *  gets the inital results
   * @param searchString 
   */
  private getResults(searchString: string): void {
    if (this.searchString !== searchString || (this.searchString === searchString && !this.showResults) || this.searchString === '') {
      this.searchString = searchString;
      window.clearTimeout(this.timeoutNumber);
      this.timeoutNumber = window.setTimeout(() => {
        this.service.getDataByText(0, searchString).subscribe(
          (result) => {
            this.results = result.items;
            this.maxResults = result.totalItems;
            this.highlightedIndex = 0;
            this.setHighlightedItem(this.results[this.highlightedIndex]);
            this.showResults = true;
            this.addScreenReaderMessage(this.maxResults + ' ' + this.resultsAvailableMessage)
          });
      }, this.settings.debounceTime);
    }
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
      let message = item[this.settings.valueProperty];
      if (this.settings.subValueProperty && item[this.settings.subValueProperty]) {
        message += ': ' + item[this.settings.subValueProperty]

      }
      this.addScreenReaderMessage(message);
    }
  }

  private addScreenReaderMessage(message: string) {
    const srResults: HTMLElement = document.createElement('li');
    srResults.innerText = message;
    if (this.srOnly && this.srOnly.nativeElement) {
      this.srOnly.nativeElement.appendChild(srResults);
    }
  }
}


export class SamHierarchicalAutocompleteSettings {

  /**
   * sets the default debounce time to 250 milliseconds 
   */
  constructor() {
    this.debounceTime = 250;
  }

  /**
   * Used to describe the drop down (Text should match the label that will be supplied)
   */
  public labelText: string;

  /**
   * Used for the Id of the control
   */
  public id: string;

  /**
   *  This is the primary field used to identify each object in the results
   */
  public keyField: string;

  /**
   *  Property from supplied model used for the top part of the basic template
   */
  public valueProperty: string;

  /**
   *  Property from supplied model used for the bottom part of the basic template
   */
  public subValueProperty: string;

  /**
   *  Sets the time waited for addional key actions Default is 250 milliseconds
   */
  public debounceTime: number;

  /**
   * Place holder text for input
   */
  public placeHolderText: string;

}
