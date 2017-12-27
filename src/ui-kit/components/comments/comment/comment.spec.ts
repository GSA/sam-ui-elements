import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamCommentsModule } from '../';
import { Comment } from '../interfaces';
import { SamCommentComponent } from './';

describe('The Sam Comment component', () => {
  let component: SamCommentComponent;
  let fixture: any;
  const imgUrl =
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg';

  const comment: Comment = {
    datetime: new Date(),
    image: imgUrl,
    text: 'I did not chop down that cherry tree',
    username: 'george-washington@gsa.gov',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SamCommentsModule ],
    });

    fixture = TestBed.createComponent(SamCommentComponent);
    component = fixture.componentInstance;
    component.comment = comment;
    fixture.detectChanges();
  });

  it('Should display a username', function() {
    const usernameEl = fixture.debugElement
      .query(
        By.css('.username')
      )
      .nativeElement;
    expect(usernameEl.innerHTML).toContain(comment.username);
  });

  xit('Should display a published time', () => {
    const timeEl = fixture.debugElement.query(By.css('time')).nativeElement;
    expect(timeEl.innerHTML).toContain(moment(comment.datetime).fromNow());
  });

  it('Should display a comment body', function() {
    const textEl = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(textEl.innerHTML).toContain(comment.text);
  });

  it('Should display an image', function() {
    const imageEl = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imageEl.src).toBe(comment.image);
  });
});
