import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamToolbarComponent } from './toolbar.component';
import { SamAsideToggleModule } from '../aside-toggle';
import { SamActionsListModule } from '../../experimental/actions-list';

@NgModule({
    imports: [
        CommonModule,
        SamAsideToggleModule,
        SamActionsListModule
    ],
    declarations: [ SamToolbarComponent ],
    exports: [ SamToolbarComponent ],
})
export class SamToolbarsModule { }