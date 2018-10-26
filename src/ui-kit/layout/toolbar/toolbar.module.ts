import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamToolbarComponent } from './toolbar.component';
import { SamAsideToggleComponent } from './aside-toggle.component';
import { SamActionsListModule } from '../../experimental';

@NgModule({
    imports: [
        CommonModule,
        SamActionsListModule
    ],
    declarations: [ SamToolbarComponent, SamAsideToggleComponent ],
    exports: [ SamToolbarComponent ],
})
export class SamToolbarsModule { }