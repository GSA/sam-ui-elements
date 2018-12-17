import {
  Component, Input, ViewChild, TemplateRef, ElementRef
} from '@angular/core';
import { HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';


@Component({
  selector: 'sam-selected-result',
  templateUrl: './selected-result.component.html',
  styleUrls: ['./selected-result.component.scss']
})
export class SamHierarchicalSelectedResultComponent {

  /**
  * Allow to insert a customized template for suggestions to use
  */
  @Input() itemTemplate: TemplateRef<any>;

  /**
   * The data model that has the selected item
   */
  @Input()
  public model: HierarchicalTreeSelectedItemModel;

  /**
  * Settings for the Selected Results control 
  */
  @Input()
  public settings: SelectedResultSettings;

  /**
   * Removes item from the model
   * @param item 
   */
  removeItem(item: object) {
    this.model.removeItem(item, this.settings.keyField);
  }
}

export class SelectedResultSettings {

  /**
   *  This is the primary field used to identify each object in the results
   */
  public keyField: string;

  /**
   *  Property from supplied model used for the top part of the basic template
   */
  public valueProperty: string;

  /**
   *  Property from supplied model used for the bottom part of the basic template
   */
  public subValueProperty: string;

  /**
  * Used to describe the drop down (Text should match the label that will be supplied)
  */
  public labelText: string;
}
