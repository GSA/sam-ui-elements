import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { HierarchicalTreeComponent } from './hierarchical-tree/hierarchical-tree.component';
import { HierarchicalTreeGridComponent } from './hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SelectedResultComponent } from './selected-result/selected-result.component';
import { HierarchicalTreeFilterComponent } from './hierarchical-tree-filter/hierarchical-tree-filter.component';
import { HierarchicalTreeHeaderComponent } from './hierarchical-tree-header/hierarchical-tree-header.component';
import { HierarchicalTreeFooterComponent } from './hierarchical-tree-footer/hierarchical-tree-footer.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AutocompleteComponent, HierarchicalTreeComponent,
    HierarchicalTreeGridComponent, SelectedResultComponent,
    HierarchicalTreeFilterComponent, HierarchicalTreeHeaderComponent,
    HierarchicalTreeFooterComponent],
  exports: [AutocompleteComponent, SelectedResultComponent,
    HierarchicalTreeComponent, HierarchicalTreeGridComponent]
})
export class HierarchicalModule { }
