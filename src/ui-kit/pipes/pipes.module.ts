import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeDisplayModule } from './date-time-display';
import { TimeAgoModule } from './time-ago';
import { ShortDateModule } from './short-date';
import { SamFilesizeModule } from './filesize';

@NgModule({
  imports: [ 
    CommonModule,
    DateTimeDisplayModule,
    SamFilesizeModule,
    ShortDateModule,
    TimeAgoModule,
  ],
  declarations: [
    
  ],
  exports: [
    SamFilesizeModule,
    TimeAgoModule,
    DateTimeDisplayModule,
    ShortDateModule,
  ],
  providers: []
})
export class SamPipesModule {}
