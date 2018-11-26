import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalTreeGridComponent } from './hierarchical-tree-grid.component';

describe('HierarchicalTreeGridComponent', () => {
  let component: HierarchicalTreeGridComponent;
  let fixture: ComponentFixture<HierarchicalTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
