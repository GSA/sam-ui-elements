import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamAsideToggleComponent } from './aside-toggle.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamAsideToggleComponent ],
    exports: [ SamAsideToggleComponent ],
})
export class SamAsideToggleModule { }