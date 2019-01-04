import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalComponent, SamHierarchicalSettings } from './hierarchical.component';

import { TreeMode, HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';

import { SamHiercarchicalServiceInterface, SearchByTextResult } from '../hierarchical-interface';

import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';



fdescribe('SamHierarchicalComponent', () => {
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
    component.service = new HierarchicalDataService();
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


export class HierarchicalDataService implements SamHiercarchicalServiceInterface {

  getDataByText(currentItems: number, searchValue?: string): Observable<SearchByTextResult> {
    let itemIncrease = 25;
    let data = Observable.of(SampleHierarchicalData);
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

  getHiercarchicalById(id?: string) {
    return null;
  }

}

export let SampleHierarchicalData = [