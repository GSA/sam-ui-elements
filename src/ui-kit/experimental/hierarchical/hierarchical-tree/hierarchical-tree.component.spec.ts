import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SamHierarchicalTreeComponent } from './hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from '../hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalTreeHeaderComponent } from '../hierarchical-tree-header/hierarchical-tree-header.component';
import { SamButtonModule } from '../../../elements';
import { SamSelectModule } from '../../../form-controls';
import { SamFormService } from '../../../form-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk';
import { SamDataTableModule } from '../../../components/data-table';
import { SamHierarchicalTreeConfiguration } from '../models/SamHierarchicalTreeConfiguration';
import { HierarchicalDataService, SampleHierarchicalData } from '../hierarchical-test-service.spec';
import 'rxjs/add/observable/of';
import { SortDirection } from "../../../components/data-table/sort.directive";

const sortOrder: SortDirection[] = ['asc', 'desc'];
const config: SamHierarchicalTreeConfiguration = {
  gridColumnsDisplayed: [],
  primaryKeyField: 'id',
  childCountField: "childCount",
  filterPlaceholderText: "",
  topLevelBreadcrumbText: "All Departments",
  primaryTextField: "name",
  minimumCharacterCountSearch: 0,
  navigateScreenReaderText: '',
  emptyResultText:''
};


describe('SamHierarchicalTreeComponent', () => {
  let component: SamHierarchicalTreeComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SamButtonModule,
        SamSelectModule,
        FormsModule,
        CommonModule,
        CdkTableModule,
        SamDataTableModule
      ],
      declarations: [SamHierarchicalTreeComponent,
        SamHierarchicalTreeGridComponent,
        SamHierarchicalTreeHeaderComponent],
      providers: [SamFormService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeComponent);
    component = fixture.componentInstance;
    component.configuration = config;
    component.service = new HierarchicalDataService();
    fixture.detectChanges();
  });

  it('Select item', () => {

    component.selectItem(SampleHierarchicalData[0]);
    fixture.detectChanges();
    expect(component.breadcrumbStack.length).toBe(1);
    expect(component.breadcrumbStackSelectable.length).toBe(2);
    expect(component.selectedValue).toBe(SampleHierarchicalData[0].id);
  });


  it('Sort Empty ', fakeAsync(() => {

    component.sortLevel.next(null);
    let list = [];
    component.gridResults.subscribe(
      value => {
        list = value
      }
    );
    fixture.detectChanges();
    tick();
    expect(list.length).toBe(1);
  }));

  it('Sort not empty ', fakeAsync(() => {
    let sortItem = {
      active: 'id',
      direction: sortOrder[0]
    }
    component.sortLevel.next(sortItem);
    let list = [];
    component.gridResults.subscribe(
      value => list = value
    );
    fixture.detectChanges();
    tick();
    expect(list.length).toBe(1);
  }));


});
