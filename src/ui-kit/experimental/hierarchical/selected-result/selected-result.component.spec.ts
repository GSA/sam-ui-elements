import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalSelectedResultComponent, SelectedResultSettings } from './selected-result.component';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';



fdescribe('SamHierarchicalSelectedResultComponent', () => {
  let component: SamHierarchicalSelectedResultComponent;
  let fixture: ComponentFixture<SamHierarchicalSelectedResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamHierarchicalSelectedResultComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalSelectedResultComponent);
    component = fixture.componentInstance;
    component.model = new HierarchicalTreeSelectedItemModel();
    component.settings = new SelectedResultSettings();
    component.settings.keyField = 'id';
    component.model.treeMode = TreeMode.SINGLE;
    component.settings.valueProperty = 'name';
    component.settings.subValueProperty = 'subtext';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
