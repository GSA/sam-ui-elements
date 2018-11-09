import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPaginationNextComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,FormsModule
    ],
    declarations: [
        SamPaginationNextComponent
    ],
    exports: [
        SamPaginationNextComponent
    ],
    entryComponents: [
        SamPaginationNextComponent
    ]
})
export class SamPaginationModule { }

export { Paginator } from './paginator';