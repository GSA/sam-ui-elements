import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header.component';

xdescribe('SamHierarchicalTreeHeaderComponent', () => {
  let component: SamHierarchicalTreeHeaderComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalTreeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
