import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamSortComponent } from './sort.component';

@NgModule({
    declarations: [ SamSortComponent ],
    exports: [ SamSortComponent ],
    imports: [CommonModule]
})
export class SamSortModule { }

export { SamSortComponent } from './sort.component';
