import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeFooterComponent } from './hierarchical-tree-footer.component';

xdescribe('SamHierarchicalTreeFooterComponent', () => {
  let component: SamHierarchicalTreeFooterComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalTreeFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
