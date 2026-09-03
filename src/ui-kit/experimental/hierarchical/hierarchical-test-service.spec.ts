/* tslint:disable */
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import {
  SamHiercarchicalServiceInterface,
  SamHiercarchicalServiceSearchItem,
  SamHiercarchicalServiceResult,
} from "./hierarchical-interface";
import { Sort } from "../../components/data-table/sort.directive";

export class HierarchicalDataService implements SamHiercarchicalServiceInterface {
  private loadedData: any[];
  constructor() {
    const data = SampleHierarchicalData;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const results = data.filter((it) => it.parentId === item.id);
      item["childCount"] = results.length;
    }
    this.loadedData = data;
  }

  getDataByText(
    currentItems: number,
    searchValue?: string
  ): Observable<SamHiercarchicalServiceResult> {
    const itemIncrease = 25;
    const data = of(this.loadedData);
    let itemsOb: Observable<Object[]>;
    if (searchValue) {
      itemsOb = data.pipe(
        map((items) =>
          items.filter(
            (itm) =>
              itm.name.indexOf(searchValue) !== -1 ||
              itm.subtext.indexOf(searchValue) !== -1
          )
        )
      );
    } else {
      itemsOb = data;
    }
    const items: object[] = this.itemsListOutofObservable(itemsOb);
    const totalItemCount = items.length;

    const maxSectionPosition = this.getMaxSectionPosition(
      currentItems,
      itemIncrease,
      totalItemCount
    );
    const subItemsitems = items.slice(currentItems, maxSectionPosition);

    const returnItem = {
      items: subItemsitems,
      totalItems: totalItemCount,
    };
    return of(returnItem);
  }

  getHiercarchicalById(
    item: SamHiercarchicalServiceSearchItem
  ): Observable<SamHiercarchicalServiceResult> {
    const itemIncrease = 15;
    const temp = this.getSortedData(this.loadedData, item.sort);
    const data = of(temp);
    const itemsOb: Observable<Object[]> = this.filterItemsByAllFields(
      item,
      undefined,
      data
    );
    const items: object[] = this.itemsListOutofObservable(itemsOb);
    const totalItemCount = items.length;

    const maxSectionPosition = this.getMaxSectionPosition(
      item.currentItemCount,
      itemIncrease,
      totalItemCount
    );
    const subItemsitems = items.slice(item.currentItemCount, maxSectionPosition);

    const returnItem = {
      items: subItemsitems,
      totalItems: totalItemCount,
    };
    return of(returnItem);
  }

  private itemsListOutofObservable(itemsOb: any) {
    let items: object[];
    itemsOb.subscribe((result) => {
      items = result;
    });
    return items;
  }

  private getMaxSectionPosition(
    currentItemCount: number,
    itemIncrease: number,
    totalItemCount: number
  ) {
    let maxSectionPosition = currentItemCount + itemIncrease;
    if (maxSectionPosition > totalItemCount) {
      maxSectionPosition = totalItemCount;
    }
    return maxSectionPosition;
  }

  private filterItemsByAllFields(
    item: SamHiercarchicalServiceSearchItem,
    itemsOb: any,
    data: any
  ) {
    if (item.searchValue) {
      itemsOb = data.pipe(
        map((items: any[]) =>
          items.filter(
            (itm) =>
              itm.parentId === item.id &&
              (itm.name.indexOf(item.searchValue) !== -1 ||
                itm.subtext.indexOf(item.searchValue) !== -1)
          )
        )
      );
    } else {
      itemsOb = data.pipe(
        map((items: any[]) => items.filter((itm) => itm.parentId === item.id))
      );
    }
    return itemsOb;
  }

  private getSortedData(data: any[], sort: Sort): any[] {
    if (!sort || !sort.active || sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      const propertyA = this.sortingDataAccessor(a, sort.active);
      const propertyB = this.sortingDataAccessor(b, sort.active);
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (sort.direction === "asc" ? 1 : -1);
    });
  }

  private sortingDataAccessor(data: any, sortHeaderId: string) {
    const value = (data as { [key: string]: any })[sortHeaderId];
    return value;
  }
}

export const SampleHierarchicalData = [
  {
    id: "1",
    parentId: null,
    name: "Level 1",
    subtext: "id 1",
    type: "Level 1",
  },
  { id: "2", parentId: "1", name: "Level 2", subtext: "id 2", type: "Level 2" },
  { id: "3", parentId: "2", name: "Level 3", subtext: "id 3", type: "Level 3" },
  { id: "4", parentId: "3", name: "Level 4", subtext: "id 4", type: "Level 4" },
  { id: "5", parentId: "4", name: "Level 5", subtext: "id 5", type: "Level 5" },
  { id: "6", parentId: "5", name: "Level 6", subtext: "id 6", type: "Level 6" },
  { id: "7", parentId: "6", name: "Level 7", subtext: "id 7", type: "Level 7" },
  { id: "8", parentId: "5", name: "Level 6", subtext: "id 8", type: "Level 6" },
  { id: "9", parentId: "8", name: "Level 7", subtext: "id 9", type: "Level 7" },
  {
    id: "10",
    parentId: "8",
    name: "Level 7",
    subtext: "id 10",
    type: "Level 7",
  },
  {
    id: "11",
    parentId: "5",
    name: "Level 6",
    subtext: "id 11",
    type: "Level 6",
  },
];
