import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamActionsDropdownComponent } from './actions-dropdown.component';
import {SamDirectivesModule} from "../../../directives";

@NgModule({
    imports: [CommonModule, SamDirectivesModule],
    declarations: [ SamActionsDropdownComponent ],
    exports: [ SamActionsDropdownComponent ],
})
export class SamActionDropdownModule { }

export { SamActionsDropdownComponent } from './actions-dropdown.component';
