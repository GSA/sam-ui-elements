import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamImageModule, SamImageComponent } from './';

describe('The Sam Image Component', () => {
  let fixture: ComponentFixture<SamImageComponent>;
  let component: SamImageComponent;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SamImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamImageComponent);
    component = fixture.debugElement;
  });

  it('supports a 160 x 160 image size', () => {

  });

  it('has an edit button', () => {});

  it('allows user to upload a file', () => {});

  it('has an API defined for saving the image', () => {});

  it('has a dummy backend', () => {});
});