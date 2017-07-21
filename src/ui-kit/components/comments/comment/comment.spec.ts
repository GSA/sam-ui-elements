import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';

// Load the implementations that should be tested
import { SamCommentsModule } from '../';
import { Comment } from '../interfaces';
import { SamCommentComponent } from './';

describe('The Sam Comment component', () => {
  let component: SamCommentComponent;
  let fixture: any;

  const comment: Comment = {
    username: 'george-washington@gsa.gov',
    text: "I did not chop down that cherry tree",
    datetime: new Date(),
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg'
  } 
  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SamCommentsModule ],
    });

    fixture = TestBed.createComponent(SamCommentComponent);
    component = fixture.componentInstance;
    component.comment = comment;
  });

  it('Should display a username', function() {
    fixture.detectChanges();
    // let paginationItems = fixture.debugElement.queryAll(By.css('.usa-pagination li'));
    // expect(paginationItems.length).toBe(9 + 2 + 2);
    const username = fixture.debugElement.query(By.css('.username'));
    expect(username).toContain(comment.username);
  });

  it('Should display a published time', () => {
    fixture.detectChanges();
    const time = fixture.debugElement.query(By.css('time'));

    expect(time).toContain(moment(comment.datetime).fromNow);
  });

  it('Should display a comment body', function() {
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('p'));
    expect(text).toContain(comment.text);
  });

  it('Should display an image', function() {
    fixture.detectChanges();
    const image = fixture.debugElement.query(By.css('img'));
    expect(image.src).toBe(comment.image);
  });
});