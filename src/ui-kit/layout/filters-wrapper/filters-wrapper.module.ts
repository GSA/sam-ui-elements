import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SamFiltersWrapperComponent } from './filters-wrapper.component';
import { SamButtonNextModule } from '../../experimental/button-next';

@NgModule({
    imports: [CommonModule,ReactiveFormsModule,SamButtonNextModule],
    declarations: [ SamFiltersWrapperComponent ],
    exports: [ SamFiltersWrapperComponent ],
})
export class SamFiltersWrapperModule { }