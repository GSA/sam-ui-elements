import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SamToolbarComponent } from './toolbar.component';
import { SamAsideToggleModule } from '../aside-toggle';
import { SamActionsListModule } from '../../experimental/actions-list';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SamAsideToggleModule,
        SamActionsListModule
    ],
    declarations: [ SamToolbarComponent ],
    exports: [ SamToolbarComponent ],
})
export class SamToolbarsModule { }