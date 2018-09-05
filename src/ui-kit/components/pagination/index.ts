import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPaginationComponent } from './pagination.component';

@NgModule({
    declarations: [ SamPaginationComponent ],
    exports: [ SamPaginationComponent ],
    imports: [CommonModule]
})
export class SamPaginationModule { }

export { SamPaginationComponent } from './pagination.component';
