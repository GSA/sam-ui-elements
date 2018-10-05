import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SamAsideToggleComponent } from './aside-toggle.component';

@NgModule({
    imports: [CommonModule,ReactiveFormsModule],
    declarations: [ SamAsideToggleComponent ],
    exports: [ SamAsideToggleComponent ],
})
export class SamAsideToggleModule { }