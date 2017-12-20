import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from '../interfaces';

@Component({
  selector: 'sam-comment',
  templateUrl: 'comment.template.html'
})
export class SamCommentComponent {
  @Input() comment: Comment;
  @Input() allowDelete: Comment;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

  emitClick(comment: Event) {
    this.onDelete.emit(this.comment);
  }
}
