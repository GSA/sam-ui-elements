import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {
  SamCommentsComponent,
  SamCommentsModule,
  CommentsService,
  Comment
} from './';
import { SamPipesModule } from '../../pipes';

import { Observable } from 'rxjs';

const washingtonImg =
  'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg';

export class CommentsDemoService implements CommentsService {

  _username: string = 'anon-user@common-components.team';
  _disabled: boolean = false;
  _comments: Comment[] = [

    {
      datetime: new Date('7/16/2017'),
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\
        Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque\
        penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
        Donec quam felis, ultricies nec, pellentesque eu, pretium.',
      username: 'carlos-dev@commoncomponents.team',
    },
    {
      datetime: new Date('6/1/2017'),
      image: washingtonImg,
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean\
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et\
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, \
      ultricies nec, pellentesque eu, pretium.',
      username: 'diego-dev@commoncomponents.team',

    },
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lorem ipsum doit amet, consectetuer adipiscing elit. Aenean\
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et\
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,\
      ultricies nec, pellentesque eu, pretium.',
      image: washingtonImg,
    },
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lorem ipsum dolor sit amet, conctetuer adipiscing elit. Aenean\
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et\
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,\
      ultricies nec, pellentesque eu, pretium.',
      image: washingtonImg,
    },
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean\
      modo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et\
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,\
      ultricies nec, pellentesque eu, pretium.',
      image: washingtonImg,
    },
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lo ipsum dolor sit amet, consectetuer adipiscing elit. Aenean\
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et \
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, \
      ultricies nec, pellentesque eu, pretium.',
      image: washingtonImg,
    },
    {
      username: 'colin-dev@commoncomponents.team',
      datetime: new Date(),
      text: 'Lo ipsum dolor sit amet, consectetuer adipiscing elit. Aenean\
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et \
      magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, \
      ultricies nec, pellentesque eu, pretium.',
      image: washingtonImg,
    },
  ];

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
    return Observable.of(this._comments);
  }

  postComment(_: any): Observable<Comment[]> {
    if (_.text === 'asdf') {
      const err = new Error('I errored, bro');
      return Observable.throw(err);
    }
    this._comments.push(_);
    return Observable.of(this._comments);
  }

  deleteComment(comment: Comment): Observable<Comment[]> {
    this._comments = this._comments.filter((item) => {
      if (item.text !== comment.text) {
        return item;
      }
    });
    return Observable.of(this._comments);
  }

  getInitialState(): Observable<Comment[]> {
    const lastTwo = -2;
    return Observable.of(this._comments.slice(lastTwo));
  }
}

describe('The Sam Comments component', () => {
  describe('isolated tests', () => {
    let component: SamCommentsComponent;
    let service: CommentsService;
    beforeEach(() => {
      service = new CommentsService();
      component = new SamCommentsComponent(service, undefined);
    });
    // service
    it('service should tell us if commenting is disabled', () => {
      expect(service.isCommentingDisabled()).toBe(false);
      service._disabled = true;
      expect(service.isCommentingDisabled()).toBe(true);
    });

    it('service should tell us if comment is deleteable', () => {
      expect(service.isCommentDeletable(undefined)).toBe(true);
    });

    it('service should return username', () => {
      expect(service.getUsername()).toBe('');
    });

    it('service should have methods that return comments', () => {
      expect(Array.isArray((service.getComments() as any).value)).toBe(true);
      expect(
        Array.isArray((service.postComment(undefined) as any).value)
      )
      .toBe(true);
      expect(
        Array.isArray((service.deleteComment(undefined) as any).value)
      )
      .toBe(true);
      expect(
        Array.isArray((service.getInitialState() as any).value)
      )
      .toBe(true);
    });

    // component
  });
  describe('rendered tests', () => {
    let component: SamCommentsComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ SamCommentsModule ],
        providers: [
          { provide: CommentsService, useClass: CommentsDemoService }
        ]
      });

      fixture = TestBed.createComponent(SamCommentsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('Should show two comments by default if more than two \
      comments are available', function() {
      const mainCompEl =
        fixture.debugElement.query(By.css('.sam-comments')).nativeElement;
      const liArray = mainCompEl.querySelectorAll('li');
      const arrLen = 2;
      expect(liArray.length).toBe(arrLen);
    });

    it('Shoud have a previous button that\
      will show an additional five comments', function() {
      fixture.debugElement.query(By.css('.show-button')).nativeElement.click();
      fixture.detectChanges();
      // NOTE: Parent accordion also has li elements, hence the need to target
      // the sam-comments HTML first before counting its children li elements.
      const mainCompEl =
        fixture.debugElement.query(By.css('.sam-comments')).nativeElement;
      const liArray = mainCompEl.querySelectorAll('li');
      const expected = 7;
      expect(liArray.length).toBe(expected);
    });

    it('Should have a Less button that will hide \
      all except the original comments', function() {
      fixture.debugElement.query(By.css('.hide-button')).nativeElement.click();
      fixture.detectChanges();
      const mainCompEl =
        fixture.debugElement.query(By.css('.sam-comments')).nativeElement;
      const liArray = mainCompEl.querySelectorAll('li');
      const expected = 2;
      expect(liArray.length).toBe(expected);
    });

    it('Should have a textarea input for adding a comment', function() {
      expect(
        fixture.debugElement.query(By.css('textarea')).nativeElement
      )
      .toBeDefined();
    });

    it('Should add a new comment when "Enter" is pressed', function() {
      const testString = 'I am a brand new comment for testing';
      component.textArea.nativeElement.value = testString;
      component.textArea.nativeElement.dispatchEvent(new Event('input'));
      // component.form.controls.text.setValue(testString);
      fixture.detectChanges();
    });

    xit('Should allow adding new comments to be disabled', function() {
      component.disabled = true;
    });

    xit('Should not allow users to input more than 250 characters', function() {
      const dummyText = 'A wonderful serenity has taken possession of my \
      entire soul, like these sweet mornings of spring which I enjoy with my \
      whole heart. I am alone, and feel the charm of existence in this spot, \
      which was created for the bliss of souls like mine. I am so h';

      component.form.controls.text.setValue(dummyText);
      fixture.detectChanges();
    });
  });
});
