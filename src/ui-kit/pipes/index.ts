import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeDisplayPipe } from './date-time-display';
import { TimeAgoPipe } from './time-ago';
import { ShortDatePipe } from './short-date/short-date.pipe';
import { FilesizePipe } from './filesize/filesize.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    FilesizePipe,
    TimeAgoPipe,
    DateTimeDisplayPipe,
    ShortDatePipe
  ],
  exports: [
    FilesizePipe,
    TimeAgoPipe,
    DateTimeDisplayPipe,
    ShortDatePipe,
  ],
  providers: []
})
export class SamPipesModule {}

export * from './date-time-display';
export * from './filesize';
export * from './short-date';
export * from './time-ago';
