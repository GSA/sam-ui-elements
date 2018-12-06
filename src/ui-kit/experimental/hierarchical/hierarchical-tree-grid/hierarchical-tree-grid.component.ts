import {
  Component,
  OnInit, ViewChild, ElementRef, Input
} from '@angular/core';
import { SamSortDirective, SamPaginationComponent, SamSortable } from '../../../components'
import { ExampleDatabase, ExampleDataSource } from '../data-source';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})

export class SamHierarchicalTreeGridComponent implements OnInit {
  @Input()
  public service: SamHiercarchicalServiceInterface;
  @Input() public templateConfigurations: any;

  exampleDatabase = new ExampleDatabase();
  dataSource: SampleDataSource | null;
  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;
  data:any[]=[];
  ngOnInit() {
    this.service.getDataByText(null).subscribe(
      (res) => {
        this.data = res;
      });
      this.dataSource = new SampleDataSource(
        this.exampleDatabase,
        this.paginator,
        this.sort
      );
  }
}



export class SampleDatabase {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }
  constructor(private reportData: any[]) {
    for (let i = 0; i < 1940; i++) { this.addProgram(); }
  }
  addProgram() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewProgram());
    this.dataChange.next(copiedData);
  }
  private createNewProgram() {
    return this.reportData[this.data.length];
  }
}

export class SampleDataSource extends DataSource<any> {
  totalcost = 0;
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  //filteredData: any[] = [];
  renderedData: any[] = [];

  constructor(private _exampleDatabase: any,
    private _paginator: SamPaginationComponent,
    private _sort: SamSortDirective) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.samSortChange,
      this._filterChange,
    ];
    return Observable.merge(...displayDataChanges).map(() => {

      const filteredData = this._exampleDatabase.data.slice().filter((item: any) => {
        const searchStr = (item.agency + item.title).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      // set total
      this.totalcost = 0;
      filteredData.map((item: any) => {
        this.totalcost += item.cost;
      });
      // Sort filtered data
      const sortedData = this.sortData(filteredData.slice());
      this.renderedData = sortedData;
      return this.renderedData;
    });
  }
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): any[] {
    if (!this._sort.active) { return data; }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      if (this._sort.active) {
        const sortable: SamSortable = this._sort.sortables.get(this._sort.active);
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
      }
    });
   
  }
}


