import {
  Component, Output,
  forwardRef, Input,
  EventEmitter, ElementRef, ViewChild
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { KeyHelper, KEYS } from '../../utilities/key-helper/key-helper';

export interface OptionModel {
  name: string;
  value: string;
  label: any;
  required: boolean;
  checked: boolean;
}
@Component({
  selector: 'sam-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamCheckboxListComponent),
    multi: true
  }]
})

export class SamCheckboxListComponent {

  /**
  * Mode to determine if single or multiple selection
  */
  @Input() public isSingleMode: boolean;

  /**
  * Sets the array of checkbox values and labels (see OptionModel[])
  */
  @Input() options: OptionModel[];

  /**
  * List of the items selected by the checkboxes or the radio buttons
  */
  public selected = [];

  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
    * Sets the form control error message
    */
  @Input() errorMessage: string;
  /**
  * Sets helpful text for the using the component
  */
  @Input() hint: string;
  /**
  * Sets required text on component
  */
  @Input() required: boolean = false;

  /**
 * Event emitted when row set is selected/unselected.
 */
  @Output() selectResults = new EventEmitter<OptionModel[]>();

  /**
  * Ul list of elements 
  */
  @ViewChild('checkboxList') checkboxListElement: ElementRef;

  /**
    * current index
    */
  private currentIndex: number = 0;
  /**
   * current Item
   */
  private currentItem: OptionModel;

  /**
 * Screen read field
 */
  @ViewChild('srOnly') srOnly: ElementRef;

  private HighlightedPropertyName = 'highlighted';
  optionsMode: string = 'checkbox';

  ngOnInit() {
    this.options.forEach(item => {
      if (item.checked) {
        this.selected = (this.selected.length > 0 && !this.isSingleMode) ? [...this.selected, item] : [item];
      }
    })
    this.selectResults.emit(this.selected);
    this.optionsMode = this.isSingleMode ? 'radio' : 'checkbox';
  }

  /**
    * On select/unselect the results
    */
  onChecked(ev, option: OptionModel): void {
    if (ev.target.checked) {
      if (this.isSingleMode) {
        this.selected = [option];
      } else {
        this.selected = [...this.selected, option];
      }
    } else {
      const index: number = this.selected.indexOf(option);
      if (index !== -1) {
        this.selected = this.selected.filter(item => item !== option);
      }
    }
    this.selectResults.emit(this.selected);
  }

  /**
    * Handling Keyboard Interaction 
    */
  onKeyDown(evt): void {
    if (KeyHelper.is(KEYS.TAB, evt)) {
      return;
    }
    else if (KeyHelper.is(KEYS.DOWN, evt)) {
      evt.preventDefault();
      if (this.currentIndex < this.options.length - 1) {
        this.currentIndex += 1;
        this.checkboxListElement.nativeElement.scrollTop = this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].offsetTop;
        this.setHighlightedItem(this.options[this.currentIndex]);
        this.setfocus();
      }
    }
    else if (KeyHelper.is(KEYS.UP, evt)) {
      evt.preventDefault();
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.checkboxListElement.nativeElement.scrollTop = this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].offsetTop;
        this.setHighlightedItem(this.options[this.currentIndex]);
        this.setfocus();
      }
    }
    else if (KeyHelper.is(KEYS.SPACE, evt)) {
      this.setSelectedItem(this.currentItem);
    }
  }

  /**
    * on hovering set current index 
    */
  onHover(index: number): void {
    this.currentIndex = index;
    this.setfocus();
    this.setHighlightedItem(this.options[this.currentIndex]);
  }

  /**
    * set selected item and emit on keyboard interaction
    */
  private setSelectedItem(item: OptionModel) {
    if (item.checked) {
      this.selected = [...this.selected, item];
    } else {
      const index: number = this.selected.indexOf(item);
      if (index !== -1) {
        this.selected = this.selected.filter(res => res !== item);
      }
    }
    this.selectResults.emit(this.selected);
  }

  /**
    * set selected item and emit on keyboard interaction
    */
  private setHighlightedItem(item: OptionModel): void {
    if (this.options && this.options.length > 0) {
      if (this.currentItem) {
        this.currentItem[this.HighlightedPropertyName] = false;
      }
      this.currentItem = item;
      this.currentItem[this.HighlightedPropertyName] = true;
      let message = item['lable'];
      this.addScreenReaderMessage(message);
    }
  }

  /**
  * adding Screen Reader Message
  */
  private addScreenReaderMessage(message: string) {
    const srResults: HTMLElement = document.createElement('li');
    srResults.innerText = message;
    if (this.srOnly && this.srOnly.nativeElement) {
      this.srOnly.nativeElement.appendChild(srResults);
    }
  }
  private setfocus() {
    this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].getElementsByTagName("input")[0].focus();
  }
}
