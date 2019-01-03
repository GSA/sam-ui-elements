import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk';
import { SamSortDirective, SamPaginationComponent, SamSortable } from '../../../components'

export interface GridTemplate {
}

export interface GridTemplateConfiguration {
  displayedColumns: string[];
  primaryKey: string
}

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {

  /**
  * Table configurations 
  */
  @Input() public templateConfigurations: GridTemplateConfiguration;

  /**
  * Allow to insert a customized template for suggestions to use
  */
  @Input() public gridTemplate: GridTemplate;

  /**
  * Allow to search the data on the table.
  */
  @Input() public filterText: string;

  /**
* Data for the Table.
*  Simple data array
* Stream that emit a array each time when the item is selected.
* Stream that changes each time when click action trigger on row.
*/
  @Input() public gridData: object[] = [];

  /**
 * Event emitted when level change is clicked
 */
  @Output() public levelChanged = new EventEmitter<object>();

  /**
 * Event emitted when row is clicked
 */
  @Output() public rowChanged = new EventEmitter<object>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<object[]>();

  public displayedColumns = ['select'];

  public selectedList: object[] = [];
  public hierarchicalDataSource: HierarchicalDataSource | null;
  public dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  @ViewChild(SamSortDirective) sort: SamSortDirective;

  ngOnChanges() {
    this.dataChange.next(this.gridData);
    if (this.hierarchicalDataSource) {
      this.hierarchicalDataSource.filter = this.filterText;
    }
  }

  ngOnInit() {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  ngAfterViewInit() {
    this.hierarchicalDataSource = new HierarchicalDataSource(
      this.dataChange,
      this.sort
    );
  }
  /**
   * On select the results
   */
  onChecked(ev, row: object): void {
    if (ev.target.checked) {
      this.selectedList = [...this.selectedList, row];
    } else {
      const index: number = this.selectedList.indexOf(row);
      if (index !== -1) {
        this.selectedList = this.selectedList.filter(item => item !== row);
      }
    }
    this.selectResults.emit(this.selectedList);
  }

  /**
   * On level change 
   */
  public onChangeLevel(ev: Event, item: object): void {
    this.levelChanged.emit(item);

  }
  /**
  * when the row is click updates the table data
  */
  onRowChange(ev, row): void {
    if (ev.target.type !== 'checkbox') {
      this.selectedList = [];
      this.rowChanged.emit(row[this.templateConfigurations.primaryKey]);
    }
  }
}

// preparing data source for the hierarchical grid
export class HierarchicalDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  filteredData: any[] = [];
  renderedData: any[] = [];

  constructor(private dataChange: any,
    private _sort: SamSortDirective) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.samSortChange,
      this._filterChange,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const filteredData = this.dataChange.value.slice().filter((item: any) => {
        const searchStr = JSON.stringify(item).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.getSortedData(filteredData.slice());
      this.renderedData = sortedData;
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