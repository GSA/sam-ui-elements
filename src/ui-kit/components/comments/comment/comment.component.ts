import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from '../interfaces';

@Component({
  selector: 'sam-comment',
  templateUrl: 'comment.template.html'
})
export class SamCommentComponent {
  /**
   * Sets comment text
   */
  @Input() comment: Comment;
  /**
   * Sets configuration to allow comment deletion
   */
  @Input() allowDelete: Comment;
  /**
   * Emits when delete action occurs
   */
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  emitClick(comment: Event) {
    this.delete.emit(this.comment);
  }
}
