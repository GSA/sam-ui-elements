import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalTreeHeaderComponent } from './hierarchical-tree-header.component';

describe('HierarchicalTreeHeaderComponent', () => {
  let component: HierarchicalTreeHeaderComponent;
  let fixture: ComponentFixture<HierarchicalTreeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalTreeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalTreeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
