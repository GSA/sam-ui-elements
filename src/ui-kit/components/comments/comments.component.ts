import {
  Component,
  Input,
  OnInit,
  Optional,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor
} from '@angular/forms';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';


import { Observable, Subscription, Subject ,of} from 'rxjs';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/catch';


import * as moment from 'moment';

import { SamAccordionComponent } from '../accordion';

import { CommentsService } from './comments.service';
import { Comment } from './interfaces';

@Component({
  selector: 'sam-comments',
  templateUrl: 'comments.template.html',
})
export class SamCommentsComponent implements OnInit {
  /**
   * Sets disabled state
   */
  @Input() public disabled: boolean = false;
  /**
   * ViewChildren
   */
  @ViewChild('showCommentsButton') public showCommentsButton: ElementRef;
  @ViewChild('hideCommentsButton') public hideCommentsButton: ElementRef;
  @ViewChild('textArea') public textArea: ElementRef;

  public form: any;


  /**
   * Observables created from DOM events
   */
  private showButtonStream: Observable<any>;
  private hideCommentsStream: Observable<any>;
  private enterEventStream: Observable<any>;

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

  /**
   * Other private variables
   */
  comments: Array<Comment> = [];
  public maxLength: number = 250;

  /**
   * Playground
   */
  private deleteStream: Subject<any> = new Subject<any>();

  constructor(private commentsService: CommentsService,
    private fb: FormBuilder) {}

  ngOnInit() {

    this.form = this.fb.group({

      datetime: undefined,
      text: [
        {
          disabled: (this.commentsService.isCommentingDisabled() ||
            this.disabled),
          value: '',
        },
        [
          Validators.required,
          Validators.maxLength(this.maxLength)
        ]
      ],
      username: this.commentsService.getUsername(),

    });

    // Register observables for 'click' events
    this.showButtonStream =
      Observable.fromEvent(this.showCommentsButton.nativeElement, 'click');
    this.hideCommentsStream =
      Observable.fromEvent(this.hideCommentsButton.nativeElement, 'click');
    this.enterEventStream =
      Observable.fromEvent(this.textArea.nativeElement, 'keyup');

    // Map DOM events to actions
    this.getCommentsStream =
      this.showButtonStream
      .flatMap(event => {
        return this.commentsService.getComments()
              .catch(error => of(error));
      });

    this.collapseCommentsStream =
      this.hideCommentsStream
      .flatMap(event => {
        return this.commentsService.getInitialState()
              .catch(error => of(error));
      });

    this.submitStream =
      this.enterEventStream
      .flatMap(event => {
        if (event.key === 'Enter' || event.keyIdentified === 'Enter') {
          this.form.controls.datetime.setValue(Date.now());
          return this.commentsService.postComment(this.form.value)
                .catch(error => of(error));
        } else {
          return of(undefined);
        }
      })
      .flatMap(event => {
        if (event instanceof Error) {
          return of(this.comments);
        } else if (event === null || event === undefined) {
          return of(this.comments);
        } else {
          this.form.controls.text.setValue('');
          return of(event)
            .catch(error => of(error));
        }
      });

    const sub =
      this.deleteStream
      .flatMap((comment) => {
        return this.commentsService.deleteComment(comment)
               .catch(err => of(err));
      })
      .flatMap((event) => {
        if (event instanceof Error) {
          return of(this.comments);
        } else {
        return of(event)
               .catch(err => of(err));
        }
      });

    // Subscribe to mapped DOM events
    this.commentsSubscription =
      this.commentsService
        .getInitialState() // Initialize stream with initial state
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
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
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
                   this.disabled );
    return ( disabled || !form.valid ) ? true : false ;
  }

  charsRemaining(): number {
    const textLength = this.form.controls.text.value ?
      this.form.controls.text.value.length :
      0;
    return this.maxLength - textLength;
  }
}
