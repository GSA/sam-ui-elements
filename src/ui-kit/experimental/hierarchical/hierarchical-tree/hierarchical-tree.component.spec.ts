import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalTreeComponent } from './hierarchical-tree.component';

describe('HierarchicalTreeComponent', () => {
  let component: HierarchicalTreeComponent;
  let fixture: ComponentFixture<HierarchicalTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
