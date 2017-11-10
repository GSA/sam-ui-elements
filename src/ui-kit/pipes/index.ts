import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeDisplayPipe } from './date-time-display';
import { TimeAgoPipe } from './time-ago';
import { ShortDatePipe } from "./short-date/short-date.pipe";

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    TimeAgoPipe,
    DateTimeDisplayPipe,
    ShortDatePipe
  ],
  exports: [
    TimeAgoPipe,
    DateTimeDisplayPipe,
    ShortDatePipe,
  ],
  providers: []
})
export class SamPipesModule {}

