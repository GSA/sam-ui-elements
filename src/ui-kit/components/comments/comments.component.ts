import { Component, Input, OnInit, Optional, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ControlValueAccessor } from '@angular/forms';

import { Observable, Subscription, Subject } from 'rxjs';
import * as moment from 'moment';

import { SamAccordionComponent } from '../accordion';

import { CommentsService } from './comments.service';
import { Comment } from './interfaces';

@Component({
  selector: 'sam-comments',
  templateUrl: 'comments.template.html',
})
export class SamCommentsComponent implements OnInit {
  @Input() public disabled: boolean = false
  /**
   * ViewChildren
   */
  @ViewChild('showCommentsButton') public showCommentsButton: ElementRef;
  @ViewChild('hideCommentsButton') public hideCommentsButton: ElementRef;
  @ViewChild('cancelButton') public cancelButton: ElementRef;
  @ViewChild('submitButton') public submitButton: ElementRef;

  /**
   * Observables created from DOM events
   */
  private showButtonStream: Observable<any>;
  private hideCommentsStream: Observable<any>;
  private cancelButtonStream: Observable<any>;
  private submitButtonStream: Observable<any>;

  /**
   * Observables that map DOM events
   */
  private getCommentsStream: Observable<any>;
  private collapseCommentsStream: Observable<any>;
  private submitStream: Observable<any>;

  /**
   * Subscriptions for Observables
   */
  private commentsSubscription: Subscription;
  private cancelSubscription: Subscription;

  /**
   * Other private variables
   */
  private comments: Array<Comment> = [];
  public form: any;
  private maxLength: number = 250;

  /**
   * Playground
   */
  private deleteStream: Subject<any> = new Subject<any>();

  constructor(private commentsService: CommentsService, private fb: FormBuilder) {}

  ngOnInit() {

    this.form = this.fb.group({
      username: this.commentsService.getUsername(),
      text: [
        {
          value: '',
          disabled: (this.commentsService.isCommentingDisabled() || this.disabled)
        },
        [ 
          Validators.required,
          Validators.maxLength(this.maxLength)
        ]
      ],
      datetime: null
    });

    /**************************************************************************/
    /* Register observables for 'click' events                                */
    /**************************************************************************/
    this.showButtonStream = Observable.fromEvent(this.showCommentsButton.nativeElement, 'click');
    this.hideCommentsStream = Observable.fromEvent(this.hideCommentsButton.nativeElement, 'click');
    this.cancelButtonStream = Observable.fromEvent(this.cancelButton.nativeElement, 'click');
    this.submitButtonStream = Observable.fromEvent(this.submitButton.nativeElement, 'click');

    /**************************************************************************/
    /* Map DOM events to actions                                              */
    /**************************************************************************/
    this.getCommentsStream = 
      this.showButtonStream
      .flatMap(event => {
        return this.commentsService.getComments()
              .catch(error => Observable.of(error));
      });

    this.collapseCommentsStream = 
      this.hideCommentsStream
      .flatMap(event => {
        return this.commentsService.getInitialState()
              .catch(error => Observable.of(error));
      });
    
    this.submitStream = 
      this.submitButtonStream
      .flatMap(event => {
        this.form.controls.datetime.setValue(Date.now());
        return this.commentsService.postComment(this.form.value)
              .catch(error => Observable.of(error));
      })
      .flatMap(event => {
        if (event instanceof Error) {
          return Observable.of(this.comments);
        } else {
          this.form.controls.text.setValue('');
          return this.commentsService.getComments()
            .catch(error => Observable.of(error));
        }
      });

    const sub = 
      this.deleteStream
      .flatMap((comment) => {
        console.log(comment);
        return this.commentsService.deleteComment(comment)
               .catch(err => Observable.of(err));
      })
      .flatMap((event) => {
        if (event instanceof Error) {
          console.log(event);
          return Observable.of(this.comments);
        } else {
        return this.commentsService.getComments()
               .catch(err => Observable.of(err));
        }
      })
  
    /**************************************************************************/
    /* Subscribe to mapped DOM events                                         */
    /**************************************************************************/
    this.commentsSubscription = 
      this.commentsService.getInitialState() // Initialize stream with initial state
      .merge(this.getCommentsStream) // Add comments stream
      .merge(this.collapseCommentsStream) // Add collapse stream
      .merge(this.submitStream) // Add submit stream
      .merge(sub)
      .subscribe(
        (comments) => {
          this.comments = comments; 
        },
        (err) => {
          console.error(err);
        }
      );

    this.cancelSubscription = 
      this.cancelButtonStream
      .subscribe(
        (event) => {
          this.form.controls.text.setValue(''); 
        },
        (err) => { console.error(err) }
      );
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
    this.cancelSubscription.unsubscribe();
  }

  isDeletable(comment: Comment): boolean {
    return this.commentsService.isCommentDeletable(comment);
  }

  onDelete(comment: Comment) {
    this.deleteStream.next(comment);
  }

  isSubmitDisabled(form: FormGroup): boolean {
    let disabled: boolean = false;
      disabled = ( this.commentsService.isCommentingDisabled() ||
                   this.disabled )
    return ( disabled || !form.valid ) ? true : false ;
  }

  charsRemaining(): number {
    const textLength = this.form.controls.text.value ? this.form.controls.text.value.length : 0;
    return this.maxLength - textLength;
  }
}