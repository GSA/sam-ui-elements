import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk';


import { SamSortDirective, SamPaginationComponent, SamSortable } from '../../../components'
import { ExampleDatabase, ExampleDataSource } from '../data-source';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { KeyHelper } from '../../../../ui-kit/utilities';
// import { KeyHelper } from 'ui-kit/utilities';



export interface GridTemplate {
  
}

export interface GridTemplateConfiguration {
  displayedColumns: any[];
}

export interface GridDataSource {
  connect: () => void;
  disconnect: () => void;
  sortData?: () => void;
}

export interface GridItem {

}

class Grid {
  @Input() public template: GridTemplate;
  @Input() public datasource: GridDataSource;
  @Input() public templateConfiguration: GridTemplateConfiguration;
  @Output() public levelChanged = new EventEmitter<GridItem>();
  @Output() public itemSelected = new EventEmitter<GridItem>();

  public displayedColumns = ['select'];
  public selected: GridItem;
  public focusedCell: any; // Should be the table cell

  public ngOnChanges () {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfiguration.displayedColumns]
  }

  public handleClick(): void {}

  public changeLevel(item: GridItem): void {
    this.levelChanged.emit(item);
  }

  public handleKeydown(keyEvent: any): void {
    switch (keyEvent.type) {
      case KeyHelper.is('down', keyEvent):
        return this.handleArrowDown(keyEvent);
      default: 
        return;
    }
  }



  private handleArrowDown (event): void {}

}




/*************************************************** */
@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {
  @Input() public service: SamHiercarchicalServiceInterface;
  @Input() public templateConfigurations: any;
  

  public displayedColumns = ['select'];

  exampleDatabase = new ExampleDatabase();
  dataSource: SampleDataSource | null;
  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;
  data:any[]=[];
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnChanges () {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  ngOnInit() {
    this.service.getDataByText(null).subscribe(
      (res) => {
        this.data = res;
       // console.log(res);
      this.dataChange.next(this.data);
      });
      this.dataSource = new SampleDataSource(
        this.dataChange,
        this.paginator,
        this.sort
      );
     
  }
}

export class SampleDataSource extends DataSource<any> {
  totalcost = 0;
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  filteredData: any[] = [];
  renderedData: any[] = [];

  constructor(private dataChange: any,
    private _paginator: SamPaginationComponent,
    private _sort: SamSortDirective) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.dataChange,
      //this._sort.samSortChange,
      this._filterChange,
    ];
    return Observable.merge(...displayDataChanges).map(() => {

      const filteredData = this.dataChange.value.slice().filter((item: any) => {
        const searchStr = (item.id + item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      // set total
      this.totalcost = 0;
      filteredData.map((item: any) => {
        this.totalcost += item.cost;
      });
      // Sort filtered data
      const sortedData = this.sortData(filteredData.slice());
     // this.renderedData = sortedData;
      return filteredData.slice();
    });
  }
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): void{
    // if (!this._sort.active) { return data; }
    // return data.sort((a, b) => {
    //   let propertyA: number | string = '';
    //   let propertyB: number | string = '';
    //   if (this._sort.active) {
    //     const sortable: SamSortable = this._sort.sortables.get(this._sort.active);
    //     const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    //     const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
    //     return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    //   }
    // });
   
  }
}


