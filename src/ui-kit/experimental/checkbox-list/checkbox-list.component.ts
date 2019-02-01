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

  @Input() public isSingleMode: boolean;

  @Input() options: OptionModel[];
  /**
  * List of the items selected by the checkboxes or the radio buttons
  */
  public selectedList: OptionModel[] = [];

  /**
 * Event emitted when row set is selected.
 */
  @Output() selectResults = new EventEmitter<OptionModel[]>();

  /**
  * Ul list of elements 
  */
  @ViewChild('checkboxList') checkboxListElement: ElementRef;

  private highlightedIndex: number = 0;
  private highlightedItem: OptionModel;
  private HighlightedPropertyName = 'highlighted';

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  optionsMode: string = 'checkbox';
  ngOnInit() {
    let list =[];
    this.options.forEach(item=>{
      if(item.checked) {
        list = [...list, item];
        // this.selectedList = list;
        this.selectResults.emit(list);
       // this.emitSelectedList(item);
      } 
    })
    this.optionsMode = this.isSingleMode ? 'radio' : 'checkbox';
  }

  emitSelectedList(option: OptionModel): void {
    this.selectedList = [...this.selectedList, option];
    this.selectResults.emit(this.selectedList);
  }

  onKeyup(event) {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    }
    else if (KeyHelper.is(KEYS.DOWN, event)) {
      this.onArrowDown();
    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      this.onArrowUp();
    }
    else if (KeyHelper.is(KEYS.SPACE, event)) {
      console.log('space clicked')
     
    }
    
    event.stopPropagation();
  }

  /**
    * On select the results
    */
  onChecked(ev, option: OptionModel): void {
    if (ev.target.checked) {
      if (this.isSingleMode) {
        this.selectedList = [option];
      } else {
        this.selectedList = [...this.selectedList, option];
      }
    } else {
      const index: number = this.selectedList.indexOf(option);
      if (index !== -1) {
        this.selectedList = this.selectedList.filter(item => item !== option);
      }
    }
    this.selectResults.emit(this.selectedList);
  }

  private onArrowUp(): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedIndex !== 0) {
        this.highlightedIndex--;
       
        this.setHighlightedItem(this.options[this.highlightedIndex]);
        this.scrollSelectedItemToTop();
      }
    }
  }

  private onArrowDown(): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedIndex < this.options.length - 1) {
        this.highlightedIndex++;
        this.setHighlightedItem(this.options[this.highlightedIndex]);
        this.scrollSelectedItemToTop();
      }
    }
  }

  private setHighlightedItem(item: OptionModel): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedItem) {
        this.highlightedItem[this.HighlightedPropertyName] = false;
      }
      this.highlightedItem = item;
      this.highlightedItem[this.HighlightedPropertyName] = true;
    }
  }


  private scrollSelectedItemToTop() {
    let selectedChild = this.checkboxListElement.nativeElement.children[this.highlightedIndex];
    this.checkboxListElement.nativeElement.scrollTop = selectedChild.offsetTop;
  }


  listItemHover(index: number): void {
    this.highlightedIndex = index;
    this.setHighlightedItem(this.options[this.highlightedIndex]);
  }

}
