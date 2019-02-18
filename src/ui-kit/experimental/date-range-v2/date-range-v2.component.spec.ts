import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamDateRangeV2Component } from './date-range-v2.component';

xdescribe('DateRangeV2Component', () => {
  let component: SamDateRangeV2Component;
  let fixture: ComponentFixture<SamDateRangeV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamDateRangeV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamDateRangeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
