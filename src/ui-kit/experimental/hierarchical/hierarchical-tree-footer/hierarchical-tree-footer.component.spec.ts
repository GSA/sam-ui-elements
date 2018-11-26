import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalTreeFooterComponent } from './hierarchical-tree-footer.component';

describe('HierarchicalTreeFooterComponent', () => {
  let component: HierarchicalTreeFooterComponent;
  let fixture: ComponentFixture<HierarchicalTreeFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchicalTreeFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchicalTreeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
