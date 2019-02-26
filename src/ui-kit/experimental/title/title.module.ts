import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamTitleComponent } from './title.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        SamTitleComponent
    ],
    exports: [
        SamTitleComponent
    ]
})
export class SamTitleModule { }
