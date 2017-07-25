import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeDisplayPipe } from './date-time-display';
import { TimeAgoPipe } from './time-ago';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    TimeAgoPipe,
    DateTimeDisplayPipe
  ],
  exports: [
    TimeAgoPipe,
    DateTimeDisplayPipe
  ],
  providers: []
})
export class SamPipesModule {}

