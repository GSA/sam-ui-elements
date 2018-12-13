import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalSelectedResultComponent } from './selected-result.component';

describe('SamHierarchicalSelectedResultComponent', () => {
  let component: SamHierarchicalSelectedResultComponent;
  let fixture: ComponentFixture<SamHierarchicalSelectedResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamHierarchicalSelectedResultComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalSelectedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
