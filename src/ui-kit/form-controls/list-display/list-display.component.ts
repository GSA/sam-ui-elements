import { Component, Input, Output, EventEmitter, OnChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ListDisplayConfig } from '../../types';

const LIST_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamListDisplayComponent),
  multi: true
}

/**
 * Sam List Display Sam List Display Component
 * This component watches for changes on the model of an input
 * and displays new values in an list.
 * It is itself a form control, so it should be used with inputs
 * where multiselection is available.
 * This component also requires an input for ngModel that is
 * initialized to an array.
 */
@Component({
  selector: 'sam-list-display',
  templateUrl: 'list-display.template.html',
  providers: [ LIST_VALUE_ACCESSOR ]
})
export class SamListDisplayComponent implements ControlValueAccessor, OnChanges{
  /**
   * The newValue property should be the model of the input
   * that this list is listening to. It updates the value in the
   * list on changes to the model.
   */
  @Input() newValue: any;
  /*
   * If true, place a "New" label next to new items
   */
  @Input() showNewIndicator: boolean = false;
  /**
   * Optional configuration object
   */
  @Input() config: ListDisplayConfig;
  /**
   * Outputs removed items
   */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  get value(): any {
    return this.selectedItems;
  }

  set value(val: any) {
    if (val !== this.selectedItems) {
      this.selectedItems = val;
      this.onChangedCallback(this.selectedItems);
    }
  }

  public selectedItems: Array<any> = [];
  public newItems: Object = {};

  public onChangedCallback: (_:any) => void = (_: any) => {};
  public onTouchedCallback: () => void = () => {};

  constructor(){}

  ngOnInit() {
    if (!this.selectedItems || this.selectedItems.constructor !== Array) {
      throw new Error('ngModel for sam-list-display must be an Array');
    }
  }

  ngOnChanges(changes: any) {
    if (!this.selectedItems || this.selectedItems.constructor !== Array) {
      throw new Error('ngModel must be an array for this component.')
    }
    if (this.newValue && this.selectedItems.indexOf(this.newValue) === -1) {
      this.onTouchedCallback();
      this.newItems[this.newValue] = true;
      this.selectedItems.push(this.newValue);
      this.onChangedCallback(this.selectedItems);
    }
  }

  removeItem(idx, value) {
    this.onTouchedCallback();
    this.selectedItems.splice(idx, 1);
    delete this.newItems[value];
    this.modelChange.emit(value);
    this.onChangedCallback(this.selectedItems);
  }

  writeValue(value) {
    if (!value) {
      value = [];
    }
    if (value !== this.selectedItems) {
      this.selectedItems = value;
    }
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  registerOnChange(fn: any) {
    this.onChangedCallback = fn;
  }

  isNewItem(item) {
    if(this.config) {
      return this.config.showNewIndicator && typeof this.newItems[item] !== 'undefined';
    }
  }
}