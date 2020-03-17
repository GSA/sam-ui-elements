import { Component, Input, TemplateRef, forwardRef } from '@angular/core';
import { SAMSDSSelectedItemModel } from './models/sds-selectedItem.model';
import { SDSSelectedResultConfiguration } from './models/SDSSelectedResultConfiguration';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SAMSDSSelectedItemModelHelper } from './models/sds-selected-item-model-helper';
const SDS_SelectedResult_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SAMSDSSelectedResultComponent),
  multi: true
};

@Component({
  selector: 'sam-sds-selected-result',
  templateUrl: './selected-result.component.html',
  styleUrls: ['./selected-result.component.scss'],
  providers: [SDS_SelectedResult_VALUE_ACCESSOR]
})
export class SAMSDSSelectedResultComponent implements ControlValueAccessor {

  /**
  * Allow to insert a customized template for suggestions to use
  */
  @Input() itemTemplate: TemplateRef<any>;

  /**
   * The data model that has the selected item
   */
  public model: SAMSDSSelectedItemModel;


  /**
  * Configuration for the Selected Results control 
  */
  @Input()
  public configuration: SDSSelectedResultConfiguration;

  /**
   * Stored Event for ControlValueAccessor
   */
  public onTouchedCallback: () => void = () => null;

  /**
   * Stored Event for ControlValueAccessor
   */
  public propogateChange: (_: any) => void = (_: any) => null;

  @Input()
  public disabled: boolean;

  /**
   * Removes item from the model
   * @param item 
   */
  removeItem(item: object) {
    if (!this.disabled) {
      SAMSDSSelectedItemModelHelper.removeItem(item, this.configuration.primaryKeyField, this.model.items);
      this.propogateChange(this.model);
      this.onTouchedCallback();
    }
  }

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


  /**
   * Gets the string value from the specifed properties of an object
   * @param object 
   * @param propertyFields comma seperated list with periods depth of object
   */
  getObjectValue(object: Object, propertyFields: string): string {
    let value = '';
    let current = object;
    let fieldSplit = propertyFields.split(',');
    for (let i = 0; i < fieldSplit.length; i++) {
      let fieldValue = fieldSplit[i];
      let fieldPartSplit = fieldValue.split('.');
      for (let j = 0; j < fieldPartSplit.length; j++) {
        let fieldCheckValue = fieldPartSplit[j];
        if (current) {
          current = current[fieldCheckValue];
        }
      }

      if (current) {
        value += current.toString() + ' ';
      }
      current = object;
    }
    return value.trim();
  }

}
