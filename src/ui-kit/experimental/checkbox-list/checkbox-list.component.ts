import {
  Component, Output,
  forwardRef, Input,
  EventEmitter,ElementRef, ViewChild
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


export class SamCheckboxListComponent  {
  @Input() headerText: string;

  @Input() public isSingleMode: boolean;

  @Input() options: OptionModel[] = [
    { name: 'id1', value: 'test', label: 'test-id1', required: false, checked: false },
    { name: 'id2', value: 'test', label: 'test-id2', required: true,  checked: true },
    { name: 'id3', value: 'test', label: 'test-id3', required: false, checked: false },
    { name: 'id4', value: 'test', label: 'test-id4', required: false, checked: false },
    { name: 'id5', value: 'test', label: 'test-id5', required: false, checked: true },
    { name: 'id6', value: 'test', label: 'test-id6', required: false, checked: false },
    { name: 'id7', value: 'test', label: 'test-id7', required: false, checked: false },
    { name: 'id8', value: 'test', label: 'test-id8', required: false, checked: false },
  ];

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
    this.optionsMode = this.isSingleMode ? 'radio' : 'checkbox';
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
   this.selectItem(this.highlightedItem);
  }
  event.stopPropagation();
 }

  private onArrowUp(): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedIndex !== 0) {
        this.highlightedIndex--;
        console.log(this.highlightedIndex);
        this.setHighlightedItem(this.options[this.highlightedIndex]);
        this.scrollSelectedItemToTop();
      }
    }
  }

  private onArrowDown(): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedIndex < this.options.length - 1) {
        this.highlightedIndex++;
        console.log(this.highlightedIndex);
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

  public selectItem(item: OptionModel): void {
  item.checked = !item.checked;
  console.log(item,'selected results');
  }

  

}
