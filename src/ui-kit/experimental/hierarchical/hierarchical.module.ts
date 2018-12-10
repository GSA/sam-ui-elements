import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamHierarchicalAutocompleteComponent } from './autocomplete/autocomplete.component';
import { SamHierarchicalTreeComponent } from './hierarchical-tree/hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from './hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalSelectedResultComponent } from './selected-result/selected-result.component';
import { SamHierarchicalTreeFilterComponent } from './hierarchical-tree-filter/hierarchical-tree-filter.component';
import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header/hierarchical-tree-header.component';
import { SamHierarchicalTreeFooterComponent } from './hierarchical-tree-footer/hierarchical-tree-footer.component';

//import { } from './autocomplete/autocomplete.component';

import { SamWrapperModule } from '../../wrappers';
import { SamDataTableModule } from '../../components';
import {SamCheckboxModule} from '../../form-controls';

@NgModule({
  imports: [
    CommonModule, FormsModule, SamWrapperModule,SamDataTableModule,SamCheckboxModule
  ],
  declarations: [SamHierarchicalAutocompleteComponent, SamHierarchicalTreeComponent,
    SamHierarchicalTreeGridComponent, SamHierarchicalSelectedResultComponent,
    SamHierarchicalTreeFilterComponent, SamHierarchicalTreeHeaderComponent,
    SamHierarchicalTreeFooterComponent],
  exports: [SamHierarchicalAutocompleteComponent, SamHierarchicalSelectedResultComponent,
    SamHierarchicalTreeComponent, SamHierarchicalTreeGridComponent]
})
export class SamHierarchicalModule { }
