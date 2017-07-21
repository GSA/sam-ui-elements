import { Observable } from 'rxjs';

import { Comment } from './'

export class CommentsService {

  private _username: string = 'anon-user@common-components.team';
  private _disabled: boolean = false;

  private comments: Comment[] = [
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg'
    },
    {
      username: 'carlos-dev@commoncomponents.team',
      datetime: new Date('7/16/2017'),
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.'
    },
    {
      username: 'diego-dev@commoncomponents.team',
      datetime: new Date('6/1/2017'),
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg'
    }
  ];

  isCommentingDisabled(): boolean {
    return this._disabled;
  }

  getUsername(): string {
    return this._username;
  }

  getComments(): Observable<Comment[]> {
    return Observable.of(this.comments);
  };

  postComment(_: any): Observable<Comment[]> {
    if (_.text === 'asdf') {
      const err = new Error('I errored, bro');
      return Observable.throw(err);
    }
    this.comments.push(_);
    return Observable.of(this.comments);
  };

  deleteComment(): Observable<Comment[]> {
    return Observable.of(null);
  };

  getInitialState(): Observable<Comment[]> {
    return Observable.of(this.comments.slice(-2));
  }
}