import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from './interfaces';

@Component({
  selector: 'sam-comments',
  templateUrl: 'comments.template.html'
})
export class SamCommentsComponent implements OnInit {

  @Input() public comments: Array<Comment> = [];

  private form: FormGroup;
  private maxLength: number = 250;
  private currentInputLength: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(this.maxLength)]]
    });
  }

  setCurrentInputLength(event) {
    return this.currentInputLength = event.length;
  }

  isSubmitDisabled(form: FormGroup) {
    return !form.valid ? true : false ;
  }

  saveComment(form: FormGroup) {
    console.log(form);
  }

  charsRemaining() {
    return this.maxLength - this.currentInputLength;
  }
}