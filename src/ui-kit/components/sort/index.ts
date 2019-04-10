import { NgModule } from '@angular/core';
import { SamSortComponent } from './sort.component';

 @NgModule({
    declarations: [ SamSortComponent ],
    exports: [ SamSortComponent ]
})
export class SamSortModule { }

 export { SamSortComponent } from './sort.component';
