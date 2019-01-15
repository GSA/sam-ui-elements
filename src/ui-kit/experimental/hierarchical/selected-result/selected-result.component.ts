import { Component, Input, TemplateRef } from '@angular/core';
import { HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';
import { SelectedResultConfiguration } from '../models/SamHierarchicalSelectedResultConfiguration';

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
  public settings: SelectedResultConfiguration;

  /**
   * Removes item from the model
   * @param item 
   */
  removeItem(item: object) {
    this.model.removeItem(item, this.settings.keyField);
  }
}
