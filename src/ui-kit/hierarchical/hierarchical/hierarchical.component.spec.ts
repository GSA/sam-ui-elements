import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SamHierarchicalComponent } from './hierarchical.component';
import { TreeMode, HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalAutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SamHierarchicalSelectedResultComponent } from '../selected-result/selected-result.component';
import { SamModalModule } from '../../components/modal';
import { SamHierarchicalConfiguration } from '../models/SamHierarchicalConfiguration';
import { SamHierarchicalTreeComponent } from '../hierarchical-tree/hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from '../hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalTreeHeaderComponent } from '../hierarchical-tree-header/hierarchical-tree-header.component';
import { SamDataTableModule } from '../../components/data-table';
import { SamElementsModule } from '../../elements/elements.module';
import { CdkTableModule } from '@angular/cdk';
import { SamSelectModule } from '../../form-controls';
import { SamFormService } from '../../form-service';
import { HierarchicalDataService } from '../hierarchical-test-service.spec';
import 'rxjs/add/observable/of';

describe('SamHierarchicalComponent', () => {
  let component: SamHierarchicalComponent;
  let fixture: ComponentFixture<SamHierarchicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamHierarchicalComponent, SamHierarchicalAutocompleteComponent,
        SamHierarchicalSelectedResultComponent, SamHierarchicalTreeComponent,
        SamHierarchicalTreeGridComponent, SamHierarchicalTreeHeaderComponent],
      imports: [FormsModule, SamModalModule, CdkTableModule,
        SamDataTableModule, SamElementsModule, SamSelectModule],
      providers: [SamFormService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalComponent);
    component = fixture.componentInstance;
    component.configuration = new SamHierarchicalConfiguration();
    component.model = new HierarchicalTreeSelectedItemModel();
    component.service = new HierarchicalDataService();
    component.model.treeMode = TreeMode.MULTIPLE;
    component.configuration.primaryKeyField = "id";
    component.configuration.id = "autocomplete1";
    component.configuration.labelText = "Autocomplete 1";
    component.configuration.primaryTextField = "name";
    component.configuration.secondaryTextField = "subtext";
    component.configuration.autocompletePlaceHolderText = "Enter text";
    component.configuration.modalTitle = "Advanced Lookup";
    component.configuration.gridColumnsDisplayed = [
      { headerText: "Id", fieldName: "id" },
      { headerText: "Name", fieldName: "name" },
      { headerText: "Sub Text", fieldName: "subtext" },
      { headerText: "Children", fieldName: "childCount" }
    ];
    component.configuration.childCountField = "childCount";
    component.configuration.topLevelBreadcrumbText = "All Departments";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should change to multiple mode when the model is updated and given a value of multiple', () => {
    expect(component.isSingleMode()).toBe(false);
    component.model.treeMode = TreeMode.SINGLE;
    expect(component.isSingleMode()).toBeTruthy();
  });

  it('Should change to  mode when the model is updated and given a value of multiple', () => {
    expect(component.isSingleMode).toBeTruthy();
    component.model.treeMode = TreeMode.MULTIPLE;
    expect(component.isSingleMode()).toBe(false);
  });

  it('Should be set as not single mode when the model is null', () => {
    component.model = null;
    expect(component.isSingleMode()).toBe(false);
  });

  it('Should set the model property when the value is written ', () => {
    let model = new HierarchicalTreeSelectedItemModel();
    component.writeValue(model);
    expect(component.model).toBe(model);
  });

  it('Should change state to disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('Should change to show mode when the modal is opened', () => {
    component.onModalClick();
    expect(component.modal.show).toBeTruthy();
  });

  it('Should not change to show mode when the modal is opened when disabled', () => {
    component.setDisabledState(true);
    component.onModalClick();
    expect(component.modal.show).toBe(false);
  }); 

  it('Should change to not show mode when the modal is closed', () => {
    component.onModalClick();
    expect(component.modal.show).toBeTruthy();
    component.onModalSubmitClick();
    expect(component.modal.show).toBe(false);
  });
});
