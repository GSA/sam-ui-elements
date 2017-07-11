import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamCommentsComponent } from './comments.component';
import { SamCommentComponent } from './comment';

import { SamTextAreaModule } from '../../form-controls/textarea';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SamTextAreaModule
  ],
  declarations: [
    SamCommentsComponent,
    SamCommentComponent
  ],
  exports: [
    SamCommentsComponent,
    SamCommentComponent
  ],
  providers: []
})
export class SamCommentsModule {}