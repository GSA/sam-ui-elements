import { Component } from '@angular/core/testing';

import { SamSortComponent } from './sort.component';

describe('The Sam Sort Component', () => {
  let component: SamSort,
      fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamSort
      ],
    });

    fixture = TestBed.createComponent(SamSort);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize`', function () {
        const el: Element = fixture.debugElement.query(By.css('#primary-content')).nativeElement;
        fixture.detectChanges();
  });
});
