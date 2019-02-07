import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeV2Component } from './date-range-v2.component';

describe('DateRangeV2Component', () => {
  let component: DateRangeV2Component;
  let fixture: ComponentFixture<DateRangeV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
