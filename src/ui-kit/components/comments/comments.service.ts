import { Observable,of } from 'rxjs';

import { Comment } from './';

export class CommentsService {

  _username: string = '';
  _disabled: boolean = false;
  _comments: Comment[] = [];

  isCommentingDisabled(): boolean {
    return this._disabled;
  }

  isCommentDeletable(comment: Comment): boolean {
    return true;
  }

  getUsername(): string {
    return this._username;
  }

  getComments(): Observable<Comment[]> {
    return of(this._comments);
  }

  postComment(_: any): Observable<Comment[]> {
    return of(this._comments);
  }

  deleteComment(comment: Comment): Observable<Comment[]> {
    return of(this._comments);
  }

  getInitialState(): Observable<Comment[]> {
    const lastTwo = -2;
    return of(this._comments.slice(lastTwo));
  }
}
