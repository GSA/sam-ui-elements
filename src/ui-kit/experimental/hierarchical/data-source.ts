import {
    SamSortable,
    SamSortDirective,
    SamPaginationComponent
  } from '../../components'
  import { merge } from 'rxjs/observable/merge';
  import { DataSource } from '@angular/cdk';
  import { RECORDS } from './data';
  import { BehaviorSubject } from 'rxjs/BehaviorSubject';
  /* tslint:disable */
  import { Observable } from 'rxjs';
  /* tslint:enable */
   export interface CFDAData {
    agency: string;
    cfdaNumber: string;
    title: string;
    status: string;
    lastUpdatedDate: string;
    obligationsUpdated: string;
    ombReviewDate: string;
    lastPublishedDate: string;
    autoPublished: string;
    cost: number;
  }
   /** An example database that the data source uses to retrieve data for the table. */
  export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<CFDAData[]> = new BehaviorSubject<CFDAData[]>([]);
    get data(): CFDAData[] { return this.dataChange.value; }
     constructor() {
      this.setupData();
    }
     setupData() {
      const copiedData = this.data.slice();
      for (let i = 0; i < RECORDS.length; i++) {
        const record = {
          agency: RECORDS[i][0],
          cfdaNumber: RECORDS[i][1],
          title: RECORDS[i][2],
          status: RECORDS[i][3],
          lastUpdatedDate: RECORDS[i][4],
          obligationsUpdated: RECORDS[i][5],
          ombReviewDate: RECORDS[i][6],
          lastPublishedDate: RECORDS[i][7],
          autoPublished: RECORDS[i][8],
          cost: Math.round(Math.random() * 100),
        };
         copiedData.push(record);
      }
      this.dataChange.next(copiedData);
    }
  }
   /**
   * Data source to provide what data should be rendered in the table. Note that the data source
   * can retrieve its data in any way. In this case, the data source is provided a reference
   * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
   * the underlying data. Instead, it only needs to take the data and send the table exactly what
   * should be rendered.
   */
  export class ExampleDataSource extends DataSource<any> {
    totalcost = 0;
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
     filteredData: CFDAData[] = [];
    renderedData: CFDAData[] = [];
     constructor(private _exampleDatabase: ExampleDatabase,
      private _paginator: SamPaginationComponent,
      private _sort: SamSortDirective) {
      super();
    }
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<CFDAData[]> {
      // Listen for any changes in the base data, sorting, filtering, or pagination
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._sort.samSortChange,
        this._filterChange,
        // this._paginator.pageChange,
      ];
       return merge(...displayDataChanges).map(() => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((item: CFDAData) => {
          const searchStr = (item.agency + item.title).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
         // set total
        this.totalcost = 0;
        this.filteredData.map((item: CFDAData) => {
          this.totalcost += item.cost;
        });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        this.renderedData = sortedData;
        return this.renderedData;
      });
    }
     disconnect() { }
     /** Returns a sorted copy of the database data. */
    sortData(data: CFDAData[]): CFDAData[] {
      if (!this._sort.active) { return data; }
       return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';
        if (this._sort.active) {
          const sortable: SamSortable = this._sort.sortables.get(this._sort.active);
          switch (sortable.id) {
            case 'agency': [propertyA, propertyB] = [a.agency, b.agency]; break;
            case 'cfdaNumber': [propertyA, propertyB] = [a.cfdaNumber, b.cfdaNumber]; break;
            case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
            case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
            case 'lastUpdatedDate': [propertyA, propertyB] = [a.lastUpdatedDate, b.lastUpdatedDate]; break;
            case 'obligationsUpdated': [propertyA, propertyB] = [a.obligationsUpdated, b.obligationsUpdated]; break;
            case 'ombReviewDate': [propertyA, propertyB] = [a.ombReviewDate, b.ombReviewDate]; break;
            case 'lastPublishedDate': [propertyA, propertyB] = [a.lastPublishedDate, b.lastPublishedDate]; break;
            case 'autoPublished': [propertyA, propertyB] = [a.autoPublished, b.autoPublished]; break;
            case 'cost': [propertyA, propertyB] = [a.cost, b.cost]; break;
          }
           const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
           return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        }
      });
    }
  }