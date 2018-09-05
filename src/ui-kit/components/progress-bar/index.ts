import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamProgress } from './progress-bar.component';

@NgModule({
    declarations: [ SamProgress ],
    exports: [ SamProgress ],
    imports: [CommonModule]
})
export class SamProgressModule { }