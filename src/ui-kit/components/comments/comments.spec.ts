import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamCommentsComponent } from './';

describe('The Sam Comments component', () => {
  it('Should display list of components', function() {});
  it('Should show two comments by default if more than two comments are available', function() {});
  it('Shoud have a previous button that will show an additional five comments', function() {});
  it('Should have a Less button that will hide all except the original comments', function() {});
  it('Should have a text input for adding a comment', function() {});
  it('Should add a new comment when "Enter" is pressed', function() {});
  it('Should allow the comment\'s author to delete the comment', function() {});
  it('Should allow adding new comments to be disabled', function() {});
  it('Should not allow users to input more than 250 characters', function() {});
});