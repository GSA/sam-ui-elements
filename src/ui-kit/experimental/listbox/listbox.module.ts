import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamWrapperModule } from '../../wrappers';
import { SamListBoxComponent } from './listbox.component';
import { AccordionsModule } from  '../../components/accordion';


@NgModule({
    imports: [CommonModule,
        SamWrapperModule,
        FormsModule,
        AccordionsModule,
        ReactiveFormsModule
    ],
    declarations: [SamListBoxComponent],
    exports: [SamListBoxComponent]
})
export class SamListboxModule { }
