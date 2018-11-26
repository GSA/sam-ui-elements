import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedResultComponent } from './selected-result.component';

describe('SelectedResultComponent', () => {
  let component: SelectedResultComponent;
  let fixture: ComponentFixture<SelectedResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
