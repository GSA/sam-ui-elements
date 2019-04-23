import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdsPaginationComponent } from './sds-pagination.component';

@NgModule({
    declarations: [ SdsPaginationComponent ],
    exports: [ SdsPaginationComponent ],
    imports: [CommonModule]
})
export class SdsPaginationModule { }

export { SdsPaginationComponent } from './sds-pagination.component';
