import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeDisplayPipe } from './date-time-display.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [ DateTimeDisplayPipe ],
    exports: [ DateTimeDisplayPipe ],
})
export class DateTimeDisplayModule { }

export * from './date-time-display.pipe';
