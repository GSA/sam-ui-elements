import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamWrapperModule } from '../../wrappers';
import { SamCheckboxListComponent } from './checkbox-list.component';
import { AccordionsModule } from  '../../components/accordion';


@NgModule({
    imports: [CommonModule,
        SamWrapperModule,
        FormsModule,
        AccordionsModule,
        ReactiveFormsModule
    ],
    declarations: [SamCheckboxListComponent],
    exports: [SamCheckboxListComponent]
})
export class SamCheckboxListModule { }
