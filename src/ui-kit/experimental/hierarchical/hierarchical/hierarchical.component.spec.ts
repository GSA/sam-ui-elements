import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalComponent, SamHierarchicalSettings } from './hierarchical.component';

import { TreeMode, HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';



describe('SamHierarchicalComponent', () => {
  let component: SamHierarchicalComponent;
  let fixture: ComponentFixture<SamHierarchicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamHierarchicalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalComponent);
    component = fixture.componentInstance;

    component.settings = new SamHierarchicalSettings();


    component.model = new HierarchicalTreeSelectedItemModel();


    component.settings.keyField = 'id';
    component.settings.id = 'autocomplete1';
    component.settings.labelText = 'Autocomplete 1';
    component.settings.valueProperty = 'name';
    component.settings.subValueProperty = 'subtext';
    component.settings.placeHolderText = "Enter text";
    component.settings.modalTitle = "Advanced Lookup";



    component.model.treeMode = TreeMode.SINGLE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
