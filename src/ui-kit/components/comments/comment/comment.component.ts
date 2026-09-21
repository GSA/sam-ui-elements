import { Component, Input, Output, EventEmitter } from "@angular/core";

import { Comment } from "../interfaces";

@Component({
  selector: "sam-comment",
  templateUrl: "comment.template.html",
  standalone: false,
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
  @Output() delete: EventEmitter<Comment> = new EventEmitter<Comment>();

  emitClick() {
    this.delete.emit(this.comment);
  }
}
