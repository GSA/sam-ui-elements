import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeComponent } from './hierarchical-tree.component';

describe('SamHierarchicalTreeComponent', () => {
  let component: SamHierarchicalTreeComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
