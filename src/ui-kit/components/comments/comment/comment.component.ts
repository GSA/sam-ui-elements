import { Component, Input } from '@angular/core';

import { Comment } from '../interfaces';

@Component({
  selector: 'sam-comment',
  templateUrl: 'comment.template.html'
})
export class SamCommentComponent {
  @Input() comment: Comment;
}