import { Component, Input, ViewChild, TemplateRef, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { SAMSDSSelectedItemModel } from '../selected-result/models/sds-selectedItem.model';
import { SAMSDSAutocompleteServiceInterface } from '../autocomplete-search/models/SAMSDSAutocompleteServiceInterface';
import { SAMSDSAutocompletelConfiguration } from './models/SDSAutocompletelConfiguration.model';
import { SelectionMode } from '../selected-result/models/sds-selected-item-model-helper';
const Autocomplete_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SAMSDSAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'sam-sds-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [Autocomplete_VALUE_ACCESSOR]
})
export class SAMSDSAutocompleteComponent implements ControlValueAccessor {


  /**
* Allow to insert a customized template for suggestions results
*/
  @Input() suggestionTemplate: TemplateRef<any>;

  /**
  * Allow to insert a customized template for selected items
  */
  @Input() selectedItemTemplate: TemplateRef<any>;

  /**
  * The data model that has the selected item
  */
  public model: SAMSDSSelectedItemModel;


  /**
   * Stored Event for ControlValueAccessor
   */
  public onTouchedCallback: () => void = () => null;

  /**
   * Stored Event for ControlValueAccessor
   */
  public propogateChange: (_: any) => void = (_: any) => null;

  public disabled: boolean;


  /**
 * Configuration for the control 
 */
  @Input()
  public configuration: SAMSDSAutocompletelConfiguration;

  /**
* Instance of the SamHiercarchicalServiceInterface provided
*/
  @Input()
  public service: SAMSDSAutocompleteServiceInterface;

  writeValue(obj: any): void {
    if (obj instanceof SAMSDSSelectedItemModel) {
      this.model = obj as SAMSDSSelectedItemModel;
    }
  }

  registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  isSingleMode(): boolean {
    if (this.configuration) {
      return this.configuration.selectionMode === SelectionMode.SINGLE;
    }
    else {
      return false;
    }
  }
}
