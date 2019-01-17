import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalAutocompleteComponent } from './autocomplete/autocomplete.component';
import { SamHierarchicalTreeComponent } from './hierarchical-tree/hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from './hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalSelectedResultComponent } from './selected-result/selected-result.component';
import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header/hierarchical-tree-header.component';
import { SamHierarchicalComponent } from './hierarchical/hierarchical.component';
import { SamWrapperModule } from '../../wrappers';
import { SamDataTableModule, SamModalModule } from '../../components';
import { SamCheckboxModule, SamSelectModule, SamTextInputModule } from '../../form-controls';
import { SamButtonModule } from '../../elements';
import { SamIconsModule } from '../icon';
import { SamDirectivesModule } from '../../directives';

@NgModule({
  imports: [
    CommonModule, FormsModule, SamWrapperModule, SamDataTableModule, SamCheckboxModule, SamSelectModule,
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
