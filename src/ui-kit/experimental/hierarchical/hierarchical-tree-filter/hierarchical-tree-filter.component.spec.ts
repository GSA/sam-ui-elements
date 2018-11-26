import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalTreeFilterComponent } from './hierarchical-tree-filter.component';

describe('HierarchicalTreeFilterComponent', () => {
  let component: HierarchicalTreeFilterComponent;
  let fixture: ComponentFixture<HierarchicalTreeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalTreeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
