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
  @Input() keyValueConfig: KeyValueConfig = { keyProperty: 'key', valueProperty: 'value' };
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

  public searchText: string;

  private innerValue: Array<any> = [];
  private isDisabled: boolean = false;

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
        const selectedChildIndex = this.getSelectedChildIndex(this.resultsList.nativeElement);
        if (selectedChildIndex !== -1) {
          this.filterOptions(event.target.value);
          this.selectItem(this.list[selectedChildIndex]);
        } else {
          this.filterOptions(event.target.value);
          this.selectItem(this.getFirstFilteredItem(this.list));
        }
        this.clearSearch();
      }
    }

    return event;
  }

  handleDownArrow(event) {
    if ( (event.code === 'ArrowDown' || event.keyIdentified === 'Down') &&
         this.resultsList.nativeElement.children.length > 0) {
      this.setSelectedChild(this.getSelectedChildIndex(this.resultsList.nativeElement),
                                 'Down',
                                 this.resultsList.nativeElement);
    }

    return event;
  }

  handleUpArrow(event) {
    if ( (event.code === 'ArrowUp' || event.keyIdentified === 'Up') &&
         this.resultsList.nativeElement.children.length > 0) {
      this.setSelectedChild(this.getSelectedChildIndex(this.resultsList.nativeElement),
                                 'Up',
                                 this.resultsList.nativeElement);
    }

    return event;
  }

  getSelectedChildIndex(element: HTMLElement): number {
    const children = element.children;

    let selectedIndex = -1;
    for (let i = 0; i < children.length; i++) {
      if (children[i].classList.contains('selected')) {
        selectedIndex = i;
      }
    }

    return selectedIndex;
  }

  setSelectedChild(currentSelectedIndex: number, direction: string, list: HTMLElement): number {
    if (currentSelectedIndex !== -1) {
      list.children[currentSelectedIndex].classList.remove('selected');
    }

    let indexToSelect;

    if (direction === 'Down') {
      if (currentSelectedIndex === -1 || currentSelectedIndex === list.children.length - 1) {
        indexToSelect = 0;
      } else {
        indexToSelect = currentSelectedIndex + 1;
      }
    } else if (direction === 'Up') {
      if (currentSelectedIndex === -1 || currentSelectedIndex === 0) {
        indexToSelect = list.children.length - 1;
      } else {
        indexToSelect = currentSelectedIndex - 1;
      }
    }

    this.addSelectedClass(list, indexToSelect);
    return indexToSelect;
  }

  addSelectedClass(element: HTMLElement, index: number): void {
    element.children[index].classList.add('selected');
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
  list = [];
  /**
   * Filters `options` by returning items in array that include the
   * search term as a substring of the objects key or value
   */
  filterOptions(searchString: string) {
    if (searchString) {
      searchString = searchString.toLowerCase();

      if (this.service && this.options.length == 0) {
        this.service.fetch(searchString, false).subscribe(
          (data) => { this.list = this.handleEmptyList(data); },
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
        this.list = this.handleEmptyList(this.options.filter((option) => {
          if ( option[this.keyValueConfig.keyProperty].toLowerCase().includes(searchString) ||
                option[this.keyValueConfig.valueProperty].toLowerCase().includes(searchString) ) {
            return option;
          }
        }));
      }
    } else {
      this.list = [];
    }
  }

  /**
   * Checks if array is empty. If so, returns an array with no key
   * and value 'No results found'.
   */
  handleEmptyList(array: any[]): any[] {
    if (array.length < 1) {
      const noResultsObject = {
        cannotBeSelected: true
      }
      noResultsObject[this.keyValueConfig.keyProperty] = null;
      noResultsObject[this.keyValueConfig.valueProperty] = 'No results found';
      return [noResultsObject];
    } else {
      return array;
    }
  }

  getFirstFilteredItem(array) {
    if (array.length > 0 && !array[0].cannotBeSelected) {
      return array[0];
    } else {
      return undefined;
    }
  }

  /***************************************************************
   * Logic for selecting/deselecting options                     *
   ***************************************************************/

  /**
   * Procedure to add an item to list of selected items
   */
  selectItem(item): void {
    if (item) {
      const tmpArray = this.value.slice();
      let findVal = tmpArray.find((el)=>{
        return el == item;
      });
      if (!findVal) {
        tmpArray.push(item);
        this.value = tmpArray;
      }
    }
    this.list = [];
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
}
