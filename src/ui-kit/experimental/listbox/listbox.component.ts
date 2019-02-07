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
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';

export interface OptionModel {
  name: string;
  value: string;
  label: any;
  required: boolean;
  checked: boolean;
  disabled: boolean;
}
@Component({
  selector: 'sam-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamListBoxComponent),
    multi: true
  }]
})


export class SamListBoxComponent implements ControlValueAccessor {
  /**
  * Deprecated, Sets the bound value of the component
  */
  @Input() model: any = [];
  /**
  * Sets the array of checkbox values and labels (see OptionsType[])
  */
  @Input() options: OptionModel[];
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the semantic description for the component
  */
  @Input() name: string;
  /**
  * Sets helpful text for the using the component
  */
  @Input() hint: string;
  /**
  * Sets required text on component
  */
  @Input() required: boolean = false;
  /**
  * Sets the form control error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Sets disabled state
  */
  @Input() disabled: boolean;
  /**
   * Sets the id
   */
  @Input() id: string;

  public optionsMode: string = 'checkbox';

  /**
* Screen read field
*/
  @ViewChild('srOnly') srOnly: ElementRef;

  /**
* Ul list of elements 
*/
  @ViewChild('checkboxList') checkboxListElement: ElementRef;

  /**
* Mode to determine if single or multiple selection
*/
  @Input() public isSingleMode: boolean;

  /**
  * current index
  */
  private currentIndex: number = 0;

  /**
 * current Item
 */
  private currentItem: OptionModel;

  private HighlightedPropertyName = 'highlighted';

  /**
  * Deprecated, Event emitted when the model value changes
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;
  /*
   * We want our model to list the checked items in the order that they appear
   * in the options list. This object allows us to efficiently determine if a
   * value is before another value
   */
  private _ordering: any = {};
  onChange: any = (c) => undefined;
  onTouched: any = () => undefined;
  get value() {
    return this.model;
  }

  set value(val) {
    this.setSelectedItem(val);
    this.onChange(this.model);
    this.onTouched();
  }

  ngOnInit() {
    // initialize the order lookup map
    for (let i = 0; i < this.options.length; i++) {
      const val = this.options[i].value;
      this._ordering[val] = i;
    }

    if (this.control) {
      this.control.valueChanges.subscribe(() => {
        this.wrapper.formatErrors(this.control);
      });
      this.wrapper.formatErrors(this.control);
    }
    this.optionsMode = this.isSingleMode ? 'radio' : 'checkbox';
  }

  setSelectedItem(val) {
    let returnVal = val;
    if (!Array.isArray(returnVal)) {
      returnVal = [];
    }
    // don't select options that are disabled
    for (const idx in this.options) {
      const lookup = returnVal.findIndex((value) => {
        return value === this.options[idx].value;
      });
      if (this.options[idx].disabled && lookup !== -1) {
        returnVal.splice(lookup, 1);
      }
    }
    this.model = returnVal;
  }

  isChecked(value) {
    return this.model.indexOf(value) !== -1;
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

  onChecked(ev, option) {
    this.onTouched();
    if (!ev.target.checked) {
      // If the option was unchecked, remove it from the model
      this.value = this.model.filter(val => val !== option);
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      const thisOrder = this._ordering[option];
      while (i < this.model.length) {
        const otherValue = this.model[i];
        // If the item being inserted is after the current value, break and
        // insert it.
        if (thisOrder <= this._ordering[otherValue]) {
          break;
        }
        i++;
      }
      if (this.isSingleMode) {
        this.value = [option]
      } else {
        const clone = this.model.indexOf('') > -1
          ? this.model.slice(1)
          : this.model.slice(0);
        clone.splice(i, 0, option);
        this.value = clone;
      }
    }
    this.emitModel();
  }

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
      this.onChecked(evt, this.currentItem);
    }
  }

  emitModel() {
    this.modelChange.emit(this.model);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    let returnValue = value;
    if (!returnValue) {
      returnValue = [];
    }
    this.setSelectedItem(returnValue);
  }
}