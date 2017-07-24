import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamCommentsComponent } from './comments.component';
import { SamCommentComponent } from './comment';
import { CommentsService } from './comments.service';

import { TimeAgoPipe } from './time-ago.pipe';

import { SamTextAreaModule } from '../../form-controls/textarea';
import { AccordionsModule } from '../accordion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamTextAreaModule,
    AccordionsModule
  ],
  declarations: [
    SamCommentsComponent,
    SamCommentComponent,
    TimeAgoPipe
  ],
  exports: [
    SamCommentsComponent,
    SamCommentComponent,
    TimeAgoPipe
  ],
})
export class SamCommentsModule {}