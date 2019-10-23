import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdsSortComponent } from './sort.component';

@NgModule({
    declarations: [ SdsSortComponent ],
    exports: [ SdsSortComponent ],
    imports: [CommonModule]
})
export class SdsSortModule { }

export { SdsSortComponent } from './sort.component';
