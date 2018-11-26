import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeGridComponent } from './hierarchical-tree-grid.component';

describe('SamHierarchicalTreeGridComponent', () => {
  let component: SamHierarchicalTreeGridComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
