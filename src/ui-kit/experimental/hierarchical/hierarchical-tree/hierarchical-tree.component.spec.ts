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
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { SamHierarchicalTreeConfiguration } from '../models/SamHierarchicalTreeConfiguration';
import { ExpectedConditions } from 'protractor';
import { Observable } from 'rxjs';
import { SamHiercarchicalServiceInterface, SearchByTextResult } from '../hierarchical-interface';
import 'rxjs/add/observable/of';
import { Sort, SortDirection } from "../../../components/data-table/sort.directive";

const sortOrder: SortDirection[] = ['asc', 'desc'];
const config: SamHierarchicalTreeConfiguration = {
  gridColumnsDisplayed: [],
  primaryKeyField: 'id',
  childCountField: "childCount",
  filterPlaceholderText: "",
  topLevelBreadcrumbText: "All Departments",
  primaryTextField: "name"
};


fdescribe('SamHierarchicalTreeComponent', () => {
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

    console.log(component.breadcrumbStack)
    expect(component.breadcrumbStack.length).toBe(1);
    expect(component.breadcrumbStackSelectable.length).toBe(2);
    expect(component.selectedValue).toBe(SampleHierarchicalData[0].id);
  });


  it('Sort Empty ', fakeAsync(() => {

    component.sortLevel.next(null);
    let list = [];
    component.gridResults.subscribe(
      value => list = value
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





export let SampleHierarchicalData = [
  { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' },
  { 'id': '2', 'parentId': '1', 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 2' },
  { 'id': '3', 'parentId': '2', 'name': 'Level 3', 'subtext': 'id 3', 'type': 'Level 3' },
  { 'id': '4', 'parentId': '3', 'name': 'Level 4', 'subtext': 'id 4', 'type': 'Level 4' },
  { 'id': '5', 'parentId': '4', 'name': 'Level 5', 'subtext': 'id 5', 'type': 'Level 5' },
  { 'id': '6', 'parentId': '5', 'name': 'Level 6', 'subtext': 'id 6', 'type': 'Level 6' },
  { 'id': '7', 'parentId': '6', 'name': 'Level 7', 'subtext': 'id 7', 'type': 'Level 7' },
  { 'id': '8', 'parentId': '5', 'name': 'Level 6', 'subtext': 'id 8', 'type': 'Level 6' },
  { 'id': '9', 'parentId': '8', 'name': 'Level 7', 'subtext': 'id 9', 'type': 'Level 7' },
  { 'id': '10', 'parentId': '8', 'name': 'Level 7', 'subtext': 'id 10', 'type': 'Level 7' },
  { 'id': '11', 'parentId': '5', 'name': 'Level 6', 'subtext': 'id 11', 'type': 'Level 6' }

];



export class HierarchicalDataService implements SamHiercarchicalServiceInterface {

  private loadedData;
  constructor() {
    const data = SampleHierarchicalData;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let results = data.filter(it => it.parentId === item.id);
      item['childCount'] = results.length;
    }
    this.loadedData = data;
  }

  getDataByText(currentItems: number, searchValue?: string): Observable<SearchByTextResult> {
    return null;
  }

  getHiercarchicalById(id: string, searchValue: string, sort: Sort): Observable<object[]> {
    let data = Observable.of(this.loadedData);
    if (searchValue) {
      return data.map(items => items.filter(itm => itm.parentId === id && (itm.name.indexOf(searchValue) !== -1 || itm.subtext.indexOf(searchValue) !== -1)));
    } else {
      return data.map(items => items.filter(itm => itm.parentId === id));
    }
  }

}
