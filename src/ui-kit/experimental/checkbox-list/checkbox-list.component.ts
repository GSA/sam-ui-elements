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
  selector: 'sam-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamCheckboxListComponent),
    multi: true
  }]
})


export class SamCheckboxListComponent implements ControlValueAccessor {
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
  * If true, an addition checkbox is added that selects all the checkboxes
  */
  @Input() hasSelectAll: boolean;
  /**
  * Sets the angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Sets disabled state
  */
  @Input() disabled: boolean;
  /**
   * Sets the id
   */
  @Input() id: string;

  public optionChange:string;

  public optionId:string;
  
  public optionsMode: string = 'checkbox';
  
  /**
  * Deprecated, Event emitted when the model value changes
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;
  activeOptions = 0;
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

  constructor() {}

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
      const clone = this.model.indexOf('') > -1
        ? this.model.slice(1)
        : this.model.slice(0);
      clone.splice(i, 0, option);
      this.value = clone;
    }
    this.emitModel();
  }

  emitModel() {
    this.modelChange.emit(this.model);
    this.optionSelected.emit({model : this.model, selected: this.optionChange, id: this.optionId});
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

// export class SamCheckboxListComponent {

//   /**
//   * Deprecated, Sets the bound value of the component
//   */
//  @Input() model: any = [];

//   /**
//   * Sets the angular FormControl
//   */
//  @Input() control: FormControl;

//   /**
//   * Mode to determine if single or multiple selection
//   */
//   @Input() public isSingleMode: boolean;

//   /**
//   * Sets the array of checkbox values and labels (see OptionModel[])
//   */
//   @Input() options: OptionModel[];

//   /**
//   * List of the items selected by the checkboxes or the radio buttons
//   */
//   public selected = [];

//   /**
//   * Sets the label text
//   */
//   @Input() label: string;
//   /**
//     * Sets the form control error message
//     */
//   @Input() errorMessage: string;
//   /**
//   * Sets helpful text for the using the component
//   */
//   @Input() hint: string;
//   /**
//   * Sets required text on component
//   */
//   @Input() required: boolean = false;

//    /**
//   * Sets disabled state
//   */
//  @Input() disabled: boolean;

//   /**
//  * Event emitted when row set is selected/unselected.
//  */
//   @Output() selectResults = new EventEmitter<OptionModel[]>();

//   /**
//   * Ul list of elements 
//   */
//   @ViewChild('checkboxList') checkboxListElement: ElementRef;

//   /**
//     * current index
//     */
//   private currentIndex: number = 0;
//   /**
//    * current Item
//    */
//   private currentItem: OptionModel;

//  /**
//   * Deprecated, Event emitted when the model value changes
//   */
//  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

//  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();


//   /**
//  * Screen read field
//  */
//   @ViewChild('srOnly') srOnly: ElementRef;

//   @ViewChild(FieldsetWrapper)
//   public wrapper: FieldsetWrapper;
  
//   onChange: any = (c) => undefined;
//   onTouched: any = () => undefined;
//   get value() {
//     return this.model;
//   }

//   set value(val) {
    
//     this.setSelectedItem(val);
//     this.onChange(this.model);
//     this.onTouched();
//   }

//   private HighlightedPropertyName = 'highlighted';
//   optionsMode: string = 'checkbox';

//   ngOnInit() {
//     this.options.forEach(item => {
//       if (item.checked) {
//         this.selected = (this.selected.length > 0 && !this.isSingleMode) ? [...this.selected, item] : [item];
//       }
//     })
//     this.model =this.selected;
//     // this.selectResults.emit(this.selected);
//     this.modelChange.emit(this.model);
//     this.optionsMode = this.isSingleMode ? 'radio' : 'checkbox';

//     if (this.control) {
//       this.control.valueChanges.subscribe(() => {
//         this.wrapper.formatErrors(this.control);
//       });

//       this.wrapper.formatErrors(this.control);
//     }
    
//   }

//   /**
//     * On select/unselect the results
//     */
//   onChecked(ev, option: OptionModel): void {
//     this.onTouched();
//     if (ev.target.checked) {
//       if (this.isSingleMode) {
//         this.selected = [option];
//       } else {
//         this.selected = [...this.selected, option];
//       }
//     } else {
//       const index: number = this.selected.indexOf(option);
//       if (index !== -1) {
//         this.selected = this.selected.filter(item => item !== option);
//       }
//     }
//     this.model = this.selected;
//     this.emitModel();
//    // this.selectResults.emit(this.selected);
//   }

//   emitModel() {

//     this.modelChange.emit(this.model);
  
//     // this.optionSelected.emit({model : this.model, selected: this.optionChange, id: this.optionId});
//   }

//   /**
//     * Handling Keyboard Interaction 
//     */
//   onKeyDown(evt): void {
//     if (KeyHelper.is(KEYS.TAB, evt)) {
//       return;
//     }
//     else if (KeyHelper.is(KEYS.DOWN, evt)) {
//       evt.preventDefault();
//       if (this.currentIndex < this.options.length - 1) {
//         this.currentIndex += 1;
//         this.checkboxListElement.nativeElement.scrollTop = this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].offsetTop;
//         this.setHighlightedItem(this.options[this.currentIndex]);
//         this.setfocus();
//       }
//     }
//     else if (KeyHelper.is(KEYS.UP, evt)) {
//       evt.preventDefault();
//       if (this.currentIndex > 0) {
//         this.currentIndex -= 1;
//         this.checkboxListElement.nativeElement.scrollTop = this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].offsetTop;
//         this.setHighlightedItem(this.options[this.currentIndex]);
//         this.setfocus();
//       }
//     }
//     else if (KeyHelper.is(KEYS.SPACE, evt)) {
//       this.setSelectedItem(this.currentItem);
//     }
//   }

//   /**
//     * on hovering set current index 
//     */
//   onHover(index: number): void {
//     this.currentIndex = index;
//     this.setfocus();
//     this.setHighlightedItem(this.options[this.currentIndex]);
//   }

//   /**
//     * set selected item and emit on keyboard interaction
//     */
//   private setSelectedItem(item: OptionModel) {
//     if (item.checked) {
//       this.selected = [...this.selected, item];
//     } else {
//       const index: number = this.selected.indexOf(item);
//       if (index !== -1) {
//         this.selected = this.selected.filter(res => res !== item);
//       }
//     }
//     this.model = this.selected;
//    // this.selectResults.emit(this.selected);
//   }

//   /**
//     * set selected item and emit on keyboard interaction
//     */
//   private setHighlightedItem(item: OptionModel): void {
//     if (this.options && this.options.length > 0) {
//       if (this.currentItem) {
//         this.currentItem[this.HighlightedPropertyName] = false;
//       }
//       this.currentItem = item;
//       this.currentItem[this.HighlightedPropertyName] = true;
//       let message = item['lable'];
//       this.addScreenReaderMessage(message);
//     }
//   }

//   /**
//   * adding Screen Reader Message
//   */
//   private addScreenReaderMessage(message: string) {
//     const srResults: HTMLElement = document.createElement('li');
//     srResults.innerText = message;
//     if (this.srOnly && this.srOnly.nativeElement) {
//       this.srOnly.nativeElement.appendChild(srResults);
//     }
//   }
//   private setfocus() {
//     this.checkboxListElement.nativeElement.getElementsByTagName("li")[this.currentIndex].getElementsByTagName("input")[0].focus();
//   }

//   setDisabledState(disabled) {
//     this.disabled = disabled;
//   }

//   registerOnChange(fn) {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn) {
//     this.onTouched = fn;
//   }

//   writeValue(value) {
//     let returnValue = value;
//     if (!returnValue) {
//       returnValue = [];
//     }

//     this.setSelectedItem(returnValue);
//   }
// }
