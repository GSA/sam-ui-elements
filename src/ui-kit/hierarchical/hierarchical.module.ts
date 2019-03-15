import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalAutocompleteComponent } from './autocomplete/autocomplete.component';
import { SamHierarchicalTreeComponent } from './hierarchical-tree/hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from './hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalSelectedResultComponent } from './selected-result/selected-result.component';
import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header/hierarchical-tree-header.component';
import { SamHierarchicalComponent } from './hierarchical/hierarchical.component';
import { SamDataTableModule } from '../components/data-table';
import { SamModalModule } from '../components/modal';
import { SamTextInputModule } from '../form-controls/text';
import { SamCheckboxModule } from '../form-controls/checkbox';
import { SamSelectModule } from '../form-controls/select';
import { SamButtonModule } from '../elements';
import { SamIconsModule } from '../experimental/icon';
import { SamDirectivesModule } from '../directives';

@NgModule({
  imports: [
    CommonModule, FormsModule,
    SamDataTableModule, SamCheckboxModule, SamSelectModule,
    SamButtonModule, SamTextInputModule, SamIconsModule, SamModalModule, SamDirectivesModule
  ],
  declarations: [SamHierarchicalAutocompleteComponent, SamHierarchicalTreeComponent,
    SamHierarchicalTreeGridComponent, SamHierarchicalSelectedResultComponent,
    SamHierarchicalTreeHeaderComponent, SamHierarchicalComponent],
  exports: [SamHierarchicalAutocompleteComponent, SamHierarchicalTreeComponent,
    SamHierarchicalTreeGridComponent, SamHierarchicalSelectedResultComponent,
    SamHierarchicalTreeHeaderComponent, SamHierarchicalComponent]
})
export class SamHierarchicalModule { }
