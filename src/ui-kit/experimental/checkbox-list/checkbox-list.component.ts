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
    { name: 'id1', value: 'test', label: 'test-id1', required: false },
    { name: 'id2', value: 'test', label: 'test-id2', required: true },
    { name: 'id3', value: 'test', label: 'test-id3', required: false },
    { name: 'id4', value: 'test', label: 'test-id4', required: false },
    { name: 'id5', value: 'test', label: 'test-id5', required: false },
    { name: 'id6', value: 'test', label: 'test-id6', required: false },
    { name: 'id7', value: 'test', label: 'test-id7', required: false },
    { name: 'id8', value: 'test', label: 'test-id8', required: false },
  ];

   /**
   * Ul list of elements 
   */
  @ViewChild('checkboxList') checkboxListElement: ElementRef;
  private highlightedIndex: number = 0;
  private highlightedItem: object;
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
 
 }

  private onArrowUp(): void {

  

    
  }

  /**
   *  handles the arrow down key event
   */
  private onArrowDown(): void {
    console.log('keyevent happend');
    // if (this.options && this.options.length > 0) {
    //   if (this.highlightedIndex !== 0) {
    //     this.highlightedIndex--;
    //     this.setHighlightedItem(this.options[this.highlightedIndex]);
        
    //   }
    // }
  }

  private setHighlightedItem(item: Object): void {
    if (this.options && this.options.length > 0) {
      if (this.highlightedItem) {
        this.highlightedItem[this.HighlightedPropertyName] = false;
      }
      this.highlightedItem = item;
      this.highlightedItem[this.HighlightedPropertyName] = true;
    }
  }

  public selectItem(item: object): void {
  console.log(item,'selected results')
  }

}
