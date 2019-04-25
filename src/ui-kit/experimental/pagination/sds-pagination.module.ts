import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdsPaginationComponent } from './sds-pagination.component';


@NgModule({
    imports: [CommonModule],
    declarations: [SdsPaginationComponent],
    exports: [SdsPaginationComponent]
})
export class SdsPaginationModule { }
