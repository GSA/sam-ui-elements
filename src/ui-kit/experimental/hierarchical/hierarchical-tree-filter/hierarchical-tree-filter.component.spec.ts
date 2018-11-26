import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeFilterComponent } from './hierarchical-tree-filter.component';

describe('SamHierarchicalTreeFilterComponent', () => {
  let component: SamHierarchicalTreeFilterComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalTreeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
