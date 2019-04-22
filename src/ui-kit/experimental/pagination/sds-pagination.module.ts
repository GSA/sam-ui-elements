import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdsPaginationComponent } from './sds-pagination.component';


@NgModule({
    imports: [CommonModule,
        SdsPaginationModule
    ],
    declarations: [SdsPaginationComponent],
    exports: [SdsPaginationModule]
})
export class SdsPaginationModule { }
