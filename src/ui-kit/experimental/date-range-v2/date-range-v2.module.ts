import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamDateRangeV2Component } from './date-range-v2.component';



@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SamDateRangeV2Component],
    exports: [SamDateRangeV2Component]
})
export class SamDateRangeV2Module { }
