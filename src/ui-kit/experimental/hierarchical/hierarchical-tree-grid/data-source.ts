import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk';
import { SamSortDirective } from '../../../components';

// preparing data source for the hierarchical grid
export class HierarchicalDataSource extends DataSource<any> {
  renderedData: any[] = [];

  constructor(private dataChange: any,
    private _sort: SamSortDirective) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.samSortChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      this.renderedData = this.getSortedData(this.dataChange.value.slice());;
      return this.renderedData;
    });
  }
  disconnect() { }
  /** Returns a sorted copy of the database data. */

  getSortedData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === '') { return data; }
    return data.sort((a, b) => {
      let propertyA = this.sortingDataAccessor(a, this._sort.active);
      let propertyB = this.sortingDataAccessor(b, this._sort.active)
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
  sortingDataAccessor: ((data: any, sortHeaderId: string) => string | number) =
    (data: any, sortHeaderId: string): string | number => {
      const value = (data as { [key: string]: any })[sortHeaderId];
      return value;
    }
}