import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPaginationNextComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { SamIconsModule } from '../../../../ui-kit/experimental/icon/icon.module';

@NgModule({
    imports: [
        CommonModule,FormsModule,
        SamIconsModule
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