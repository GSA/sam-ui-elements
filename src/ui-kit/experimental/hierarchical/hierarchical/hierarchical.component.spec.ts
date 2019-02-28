import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalComponent } from './hierarchical.component';
import { TreeMode, HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';
import { SamHiercarchicalServiceInterface, SamHiercarchicalServiceSearchItem, SamHiercarchicalServiceResult } from '../hierarchical-interface';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalAutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SamHierarchicalSelectedResultComponent } from '../selected-result/selected-result.component';
import { SamModalModule } from '../../../components/modal';
import { SamHierarchicalConfiguration } from '../models/SamHierarchicalConfiguration';
import { SamHierarchicalTreeComponent } from '../hierarchical-tree/hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from '../hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalTreeHeaderComponent } from '../hierarchical-tree-header/hierarchical-tree-header.component';
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { SamElementsModule } from '../../../elements/elements.module';
import { Observable } from 'rxjs';
import { CdkTableModule } from '@angular/cdk';
import { SamSelectModule } from '../../../form-controls';
import { SamFormService } from '../../../form-service';
import { By } from '@angular/platform-browser';
import { Sort } from '../../../components/data-table/sort.directive';
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


  it('single mode', () => {
    expect(component.isSingleMode()).toBe(false);
    component.model.treeMode = TreeMode.SINGLE;
    expect(component.isSingleMode()).toBeTruthy();
  });
});


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

  getDataByText(currentItems: number, searchValue?: string): Observable<SamHiercarchicalServiceResult> {
    let itemIncrease = 25;
    let data = Observable.of(this.loadedData);
    let itemsOb: Observable<Object[]>;
    if (searchValue) {
      itemsOb = data.map(items => items.filter(itm =>
        (itm.name.indexOf(searchValue) !== -1 ||
          itm.subtext.indexOf(searchValue) !== -1
        )));
    } else {
      itemsOb = data;
    }
    let items: object[];
    itemsOb.subscribe(
      (result) => {
        items = result;
      }
    );
    let totalItemCount = items.length;

    let maxSectionPosition = currentItems + itemIncrease;
    if (maxSectionPosition > totalItemCount) {
      maxSectionPosition = totalItemCount;
    }
    let subItemsitems = items.slice(currentItems, maxSectionPosition);

    let returnItem = {
      items: subItemsitems,
      totalItems: totalItemCount
    };
    return Observable.of(returnItem);
  }

  getHiercarchicalById(item: SamHiercarchicalServiceSearchItem): Observable<SamHiercarchicalServiceResult> {
    let itemIncrease = 15;
    let temp = this.getSortedData(this.loadedData, item.sort);
    let data = Observable.of(temp);
    let itemsOb: Observable<Object[]>;
    if (item.searchValue) {
      itemsOb = data.map(items => items.filter(itm =>
        itm.parentId === item.id &&
        (itm.name.indexOf(item.searchValue) !== -1 ||
          itm.subtext.indexOf(item.searchValue) !== -1
        )));
    } else {
      itemsOb = data.map(items => items.filter(itm => itm.parentId === item.id));
    }
    let items: object[];
    itemsOb.subscribe(
      (result) => {
        items = result;
      }
    );
    let totalItemCount = items.length;

    let maxSectionPosition = item.currentItemCount + itemIncrease;
    if (maxSectionPosition > totalItemCount) {
      maxSectionPosition = totalItemCount;
    }
    let subItemsitems = items.slice(item.currentItemCount, maxSectionPosition);

    let returnItem = {
      items: subItemsitems,
      totalItems: totalItemCount
    };
    return Observable.of(returnItem);
  }


  private getSortedData(data: any[], sort: Sort): any[] {
    if (!sort || (!sort.active || sort.direction === '')) { return data; }
    return data.sort((a, b) => {
      let propertyA = this.sortingDataAccessor(a, sort.active);
      let propertyB = this.sortingDataAccessor(b, sort.active)
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }

  private sortingDataAccessor: ((data: any, sortHeaderId: string) => string | number) =
    (data: any, sortHeaderId: string): string | number => {
      const value = (data as { [key: string]: any })[sortHeaderId];
      return value;
    }

}

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
