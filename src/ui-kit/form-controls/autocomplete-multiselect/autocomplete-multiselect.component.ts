import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, Optional, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AutocompleteService } from '../autocomplete/autocomplete.service';

@Component({
  selector: 'sam-autocomplete-multiselect',
  templateUrl: 'autocomplete-multiselect.template.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SamAutocompleteMultiselectComponent), multi: true}
  ]
})
export class SamAutocompleteMultiselectComponent implements ControlValueAccessor {
  /**
   * Gets DOM element for the textarea used for input
   */
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild('hiddenText') hiddenText: ElementRef;
  @ViewChild('resultsList') resultsList: ElementRef;

  /**
   * Options should be an array of objects that contain the key value pairs to be 
   * used to select in the component.
   */
  @Input() options: Array<any> = [];
  /**
   * Key Value Config is an object that sets which property on the options objects
   * should be used to display the key, value, and subhead properties in the list.
   */
  @Input() keyValueConfig: KeyValueConfig = { keyProperty: 'key', valueProperty: 'value', parentCategoryProperty: 'category' };
  /**
   * Used by labelWrapper. Makes field required and displays required on label.
   * See labelWrapper for more detail.
   */
  @Input() required: boolean;
  /**
   * Used by labelWrapper. Displays a label above input.
   * See labelWrapper for more detail.
   */
  @Input() label: string;
  /**
   * Used by labelWrapper. Provides a hint on how to use field.
   * See labelWrapper for more detail.
   */
  @Input() hint: string;
  /**
   * Used by labelWrapper. Provides a name for input and label.
   * See labelWrapper for more detail.
   */
  @Input() name: string;
  /**
   * Provides an array of categories for selection
   * when also setting categoryIsSelectable property
   * to true.
   * 
   * The array should be the object for the category
   * to be selected.
   */
  @Input() categories: Array<any> = [];
  /**
   * Provides the option to allow categories to be selected
   */
  @Input() categoryIsSelectable: boolean = false;

  public searchText: string;

  private innerValue: Array<any> = [];
  private isDisabled: boolean = false;
  private list: any = [];

  private onChangeCallback: (_: any) => void = (_: any) => {};
  private onTouchedCallback: () => void = () => {};

  set value(val: any) {
    this.innerValue = val;
    this.onChangeCallback(this.innerValue);
  }

  get value() {
    return this.innerValue;
  }

  constructor(@Optional() private service: AutocompleteService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.list = this.sortByCategory(this.list);
  }

  /***************************************************************
   * Handling key events                                         *
   ***************************************************************/

  /**
   * Checks if event code was `Backspace`. Procedure then removes
   * the last selected item if there is no user input in the text
   * area.
   */
  handleBackspaceEvent(event) {
    if (event.code === 'Backspace' || event.keyIdentified === 'Backspace') {
      if (event.target.value === "" && this.value.length > 0) {
        this.deselectItem(this.value[this.value.length - 1]);
      }
    }

    return event;
  }

  /**
   * Checks if event key code was `Enter`. If so, prevents default
   * behavior.
   *
   * For this component, the point is to stop the browser from
   * inserting a return character into the text area.
   */
  handleEnterEvent(event) {
    if (event.code === 'Enter' || event.keyIdentified === 'Enter') {
      event.preventDefault();
    }

    return event;
  }

  /**
   * Checks if event key code was `Enter`. If so and text area has
   * a value, procedure calls filterOptions and selects the first
   * item that is returned.
   */
  selectOnEnter(event) {
    if (event.code === 'Enter' || event.keyIdentified === 'Enter') {
      if (event.target.value) {
        const results = this.getResults();
        const selectedChildIndex = this.getSelectedChildIndex(results);

        this.selectItem(this.getItem());
        this.clearSearch();
      }
    }

    return event;
  }

  getItem(): any {
    const results = this.getResults();
    const selectedChildIndex = this.getSelectedChildIndex(results);

    const selectedResultIndex: number = selectedChildIndex === -1 ? 0 : selectedChildIndex;

    if (results[selectedResultIndex].classList.contains('category-name')) {
      return this.categories.filter((item) => {
        if (item[this.keyValueConfig.parentCategoryProperty] === results[selectedResultIndex].attributes['data-category'].value) {
          return item;
        }
      })[0];
    } else {
        const categoryIndex = parseInt(results[selectedResultIndex].attributes['data-category'].value);
        const itemIndex = parseInt(results[selectedResultIndex].attributes['data-index'].value);
        return this.getItemFromListByIndices(categoryIndex, itemIndex);
    }
  }

  getItemFromListByIndices(categoryIndex, itemIndex) {
    return this.list[categoryIndex][itemIndex];
  }

  handleDownArrow(event) {
    if ( event.code === 'ArrowDown' || event.keyIdentified === 'Down' ) {
      const results = this.getResults();
      this.setSelectedChild(this.getSelectedChildIndex(results),
                                'Down',
                                results);
    }

    return event;
  }

  handleUpArrow(event) {
    if ( event.code === 'ArrowUp' || event.keyIdentified === 'Up' ) {
      const results = this.getResults();
      this.setSelectedChild(this.getSelectedChildIndex(results),
                                 'Up',
                                 results);
    }

    return event;
  }

  getResults() {
    if (this.categoryIsSelectable) {
      return this.resultsList.nativeElement.querySelectorAll('li.category-item, li.category-name');
    } else {
      return this.resultsList.nativeElement.querySelectorAll('li.category-item');
    }
  }

  getSelectedChildIndex(elements: any): number {
    let selectedIndex = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains('selected')) {
        selectedIndex = i;
      }
    }

    return selectedIndex;
  }

  setSelectedChild(currentSelectedIndex: number, direction: string, elements: any): number {
    if (currentSelectedIndex !== -1) {
      elements[currentSelectedIndex].classList.remove('selected');
    }

    let indexToSelect;

    if (direction === 'Down') {
      if (currentSelectedIndex === -1 || currentSelectedIndex === elements.length - 1) {
        indexToSelect = 0;
      } else {
        indexToSelect = currentSelectedIndex + 1;
      }
    } else if (direction === 'Up') {
      if (currentSelectedIndex === -1 || currentSelectedIndex === 0) {
        indexToSelect = elements.length - 1;
      } else {
        indexToSelect = currentSelectedIndex - 1;
      }
    }

    this.addSelectedClass(elements, indexToSelect);
    return indexToSelect;
  }

  addSelectedClass(elements: any, index: number): void {
    elements[index].classList.add('selected');
  }

  /***************************************************************
   * Logic for calculating CSS widths for textarea               *
   ***************************************************************/

  /**
   * Procedure to set the text area width
   * as the content changes.
   */
  applyTextAreaWidth(event) {
    if(event.key != "ArrowDown" && event.key != "ArrowUp"){
      this.filterOptions(this.searchText);
    }
    this.ref.detectChanges();

    event.target.style.width = event.target.value ? this.calculateTextAreaWidth(event.target) : 'initial';

    return event;
  }

  /**
   * Takes the current content of the textarea, an HTMLElement,
   * and checks if the combined content of the textarea and the
   * spans (selected items) is wider than the content area of
   * the parent element.
   *
   * Returns 100% -- to push textarea to a new line -- if true and
   * initial -- to keep textarea on same line -- if false.
   */
  calculateTextAreaWidth(element: HTMLElement): string {
    // Width by default should be its `initial` value
    let widthValue = 'initial';

    const totalContentWidth = this.getInternalElementWidth(this.hiddenText.nativeElement) +
                              this.getSelectedContentWidth(element);

    if (totalContentWidth > this.getParentContentWidth(element.parentElement)) {
      widthValue = '100%';
    }

    return widthValue;
  }

  /**
   * Gets the width of the selected items displayed in
   * the content area of the sam-autocomplete-multiselect.
   * The width in this case includes the entire box model:
   * margin, border, padding, content.
   *
   * Returns a float of the width
   */
  getSelectedContentWidth(element: HTMLElement): number {
    const elementChildren = element.parentElement.children;

    let width = 0;
    // Cannot use forEach here since children is not a Javascript array
    // and its data structure does not provide forEach on its
    // prototype.
    for (let i = 0; i < elementChildren.length; i++) {
      if (elementChildren[i] !== element && !elementChildren[i].classList.contains('usa-sr-only')) {
        const childStyles = window.getComputedStyle(elementChildren[i]);
        let childWidth = parseFloat(childStyles.width);
        width += ( childWidth +
                   parseFloat(childStyles["margin-right"]) +
                   parseFloat(childStyles["margin-left"]) );
      }
    }

    return width;
  }

  /**
   * Takes an HTMLElement and returns the width of the content only.
   *
   * Returns the width as a float.
   */
  getParentContentWidth(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    let width = parseFloat(styles.width);

    if (styles['box-sizing'] === 'border-box') {
      width -= ( parseFloat(styles['border-left-width']) +
                 parseFloat(styles['padding-left']) +
                 parseFloat(styles['padding-right']) +
                 parseFloat(styles['border-right-width']) );
    }

    return width;
  }

  /**
   * Takes an HTMLElement and calculates the internal width (content + padding)
   * Returns the width as a float
   */
  getInternalElementWidth(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    let width = parseFloat(styles.width);

    /**
     * If the box-sizing is set to border-box, the width includes
     * everything in the box model except margins. This method
     * specifically needs to have the border removed from the
     * calculation.
     */
    if (styles['box-sizing'] === 'border-box') {
      width -= ( parseFloat(styles['border-left-width']) +
                 parseFloat(styles['border-right-width']) );
    }

    return width;
  }

  /***************************************************************
   * Logic for filtering options                                 *
   ***************************************************************/
  /**
   * Filters `options` by returning items in array that include the
   * search term as a substring of the objects key or value
   */
  filterOptions(searchString: string) {
    const availableCategories = [];
    if (searchString) {
      searchString = searchString.toLowerCase();

      if (this.service && this.options.length === 0) {
        this.service.fetch(searchString, false).subscribe(
          (data) => { this.list = this.handleEmptyList(this.sortByCategory(data)); },
          (err) => {
            const errorObject = {
              cannotBeSelected: true
            }
            errorObject[this.keyValueConfig.valueProperty] = 'An error occurred.';
            errorObject[this.keyValueConfig.subheadProperty] = 'Please try again.';
            return [errorObject];
          }
        )
      } else {
        this.list = this.options.filter((option) => {
          if (this.categoryIsSelectable) {
            if (option[this.keyValueConfig.categoryProperty] && 
                option[this.keyValueConfig.categoryProperty].toLowerCase().includes(searchString) &&
                availableCategories.indexOf(option[this.keyValueConfig.categoryProperty]) === -1
                ) {
              availableCategories.push(option[this.keyValueConfig.categoryProperty]);
            }
          }
          if ( option[this.keyValueConfig.keyProperty].toLowerCase().includes(searchString) ||
                option[this.keyValueConfig.valueProperty].toLowerCase().includes(searchString) ) {
            return option;
          }
        });
      }
    } else {
      this.list = [];
    }
    this.list = this.sortByCategory(this.list);
    if (this.categoryIsSelectable) {
      availableCategories.forEach((category) => {
        if (this.list.categories.indexOf(category) === -1) {
          this.list.categories.push(category);
        }
      });
    }
    this.list = this.handleEmptyList(this.list);
    return this.list;
  }

  /**
   * Procedure to check this.list for categories 
   * and sort data by category
   */
  sortByCategory(results: Array<any>): Array<any> {
    /**
     * Initializes a data structure to sort data by categories.
     * Object works like an associative array with additional 
     * properties to support the ui layer and component logic.
     * 
     * Each category is stored in the categories array property
     * and is given a corresponding property number to match
     * its position in the categories array.
     * 
     * totalItems is a method that counts the total number of
     * items in each category in lieu of a length property
     * for the entire data structure.
     */
    const initialObject = {
      0: [],
      categories: ['uncategorized'],
      totalItems: function(this) {
        let totalItems = 0;
        this.categories.forEach((category, index) => {
          if (this[index]) {
            totalItems = totalItems + this[index].length;
          }
        }, this);
        return totalItems;
      }
    };

    return results.reduce((prev, curr) => {
      const category = this.keyValueConfig.categoryProperty;
      if (curr[category]) {
        const categoryIndex = prev.categories.indexOf(curr[category]);
        if (categoryIndex !== -1) {
          prev[categoryIndex].push(curr);
        } else {
          const newLength = prev.categories.push(curr[category]);
          prev[newLength - 1] = [curr];
          prev[newLength - 1].category = curr[category];
        }
      } else {
        prev[0].push(curr);
      }
      return prev;
    }, initialObject);

  }

  /**
   * Checks if array is empty. If so, returns an array with no key
   * and value 'No results found'.
   */
  handleEmptyList(object: any): any[] {
    if (object.categories.length === 1 && object[0].length === 0) {
      const noResultsObject = {
        cannotBeSelected: true
      };
      noResultsObject[this.keyValueConfig.keyProperty] = null;
      noResultsObject[this.keyValueConfig.valueProperty] = 'No results found';
      object[0].push(noResultsObject);
    };

    return object;
  }

  getFirstFilteredItem(array) {
    if (array.length > 0 && !array[0].cannotBeSelected) {
      return array[0];
    } else {
      return undefined;
    }
  }

  displayList(): boolean {
    if (!this.searchText) {
      return false;
    } else if (this.list && this.list.categories) {
      if (this.list.categories.length > 1) {
        return true;
      } else if (this.list.categories.length === 1 && (this.list[0] && this.list[0].length > 0)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  displaySublist(category: string, categoryIndex: number) {
    if (this.categoryIsSelectable) {
      return true;
    } else {
      return this.list[categoryIndex].length > 0;
    }
  }

  /***************************************************************
   * Logic for selecting/deselecting options                     *
   ***************************************************************/

  /**
   * Procedure to add an item to list of selected items
   */
  selectItem(item): void {
    if (item && !item.cannotBeSelected) {
      const tmpArray = this.value.slice();
      let findVal = tmpArray.find((el) => {
        return el == item;
      });
      if (!findVal) {
        tmpArray.push(item);
        this.value = tmpArray;
      }
    }
    this.list = [];
  }

  selectItemByCategory(category: string): void {
    if (category && this.categoryIsSelectable) {
      const categoryObject = this.categories.filter((item) => {
        if (item[this.keyValueConfig.parentCategoryProperty] === category) {
          return item;
        }
      })[0];

      this.selectItem(categoryObject);
    }
  }

  /**
   * Procedure to remove an item from list of selected items
   */
  deselectItem(selectedItem): void {
    this.value = this.value.filter((item) => {
      if (item !== selectedItem) {
        return item;
      }
    });
  }

  /**
   * Procedure to remove all selected items
   */
  deselectAll() {
    this.value = [];
  }

  clearSearch() {
    this.searchText = "";
  }

  focusTextArea() {
    this.textArea.nativeElement.focus();
  }

  checkForFocus(event) {
    this.clearSearch();
    this.list=[];
  }

  /***************************************************************
   * Implementation of ControlValueAccessor Methods              *
   ***************************************************************/

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}

export interface KeyValueConfig {
  keyProperty: string;
  valueProperty: string;
  subheadProperty?: string;
  categoryProperty?: string;
  parentCategoryProperty?: string;
}
