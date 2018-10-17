import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamMultiSelectDropdownComponent } from './multiselect-dropdown.component';
import { SamCheckboxModule } from '../../form-controls/checkbox'; 
import { SamClickOutsideModule } from '../../../ui-kit/directives';
@NgModule({
    declarations: [ SamMultiSelectDropdownComponent ],
    exports: [ SamMultiSelectDropdownComponent ],
    imports: [CommonModule, SamCheckboxModule, SamClickOutsideModule]
})
export class SamMultiSelectDropdownModule { }

export {
  SamMultiSelectDropdownComponent
} from './multiselect-dropdown.component';
