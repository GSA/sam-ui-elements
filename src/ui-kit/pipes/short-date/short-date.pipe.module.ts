import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortDatePipe } from './short-date.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [ ShortDatePipe ],
    exports: [ ShortDatePipe ],
})
export class ShortDateModule { }
