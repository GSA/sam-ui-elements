import { Component, Input, Output, Optional, OnInit, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AutocompleteService } from '../autocomplete/autocomplete.service';
import { OptionsType, AutocompleteDropdownButton, AutocompleteDropdownButtonIcon } from '../../types';

const AUTOCOMPLETE_DROPDOWN_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamAutocompleteDropdownComponent),
  multi: true
};

/**
 * Sam Autocomplete Dropdown Component
 * This component combines the autocomplete with a select input.
 * It creates an autocomplete field which fetches data based on the selection 
 * from the select dropdown. 
 * An optional button can be added as well.
 */
@Component({
  selector: 'sam-autocomplete-dropdown',
  templateUrl: 'autocomplete-dropdown.template.html',
  providers: [ AUTOCOMPLETE_DROPDOWN_ACCESSOR]
})
export class SamAutocompleteDropdownComponent implements ControlValueAccessor, OnInit {
  /**
   * A string value that creates a name for the select and input child components
   * used inside the parent component
   */
  @Input() public name: string;
  /**
   * A string value to provide a label for the form control
   */
  @Input() public label: string;
  /**
   * The model that is passed to the dropdown to create the select input
   */
  @Input() public options: OptionsType[];
  /**
   * A model that allows the user to add an optional button to the dropdown component
   */
  @Input() public button: AutocompleteDropdownButton;
  /**
   * An event emitter that emits if the optional button is pressed
   */
  @Output() public onButtonPressed: EventEmitter<any> = new EventEmitter<any>();

  public selectedOption: any;

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.propogateChange(val);
    }
  }

  private _value: any;
  private onTouchedCallback: () => void = () => {};
  private propogateChange: (_: any) => void = (_: any) => {};

  constructor(@Optional() public autocompleteService: AutocompleteService) {}

  ngOnInit() {
    this.selectedOption = this.options[0];
    if (!this.name) {
      throw new Error('SAM Autocomplete Dropdown Component must have a name.');
    }
  }

  detectSelection(event: Event) {
    if (event && this.autocompleteService) {
      this.autocompleteService.setFetchMethod(this.selectedOption);
    }
  }

  writeValue(value: any) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any) {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  emitButtonPress(event: any) {
    this.onButtonPressed.emit(event);
  }
}
