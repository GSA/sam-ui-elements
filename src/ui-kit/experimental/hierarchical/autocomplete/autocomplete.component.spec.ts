import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalAutocompleteComponent } from './autocomplete.component';

describe('SamHierarchicalAutocompleteComponent', () => {
  let component: SamHierarchicalAutocompleteComponent;
  let fixture: ComponentFixture<SamHierarchicalAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamHierarchicalAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
