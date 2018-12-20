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
  displayedColumns: any[];
  type: string,
  filterText: string
}

export interface GridDataSource {
  connect: () => void;
  disconnect: () => void;
  sortData?: () => void;
}

export interface GridItem {
}

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {
  @Input() public templateConfigurations: GridTemplateConfiguration;
  @Input() public template: GridTemplate;
  @Input() public dataSource: any[] = [];
  @Input() public filterText: string;
  @Input() public viewTye: string;

  @Output() public itemSelected = new EventEmitter<GridItem>();
  @Output() public levelChanged = new EventEmitter<GridItem>();
  @Output() public rowChanged = new EventEmitter<GridItem>();


  public selectedItem: GridItem;
  public displayedColumns = ['select'];
  public samTableDataSource: any | null;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public focusedCell: any;

  @Input() public selectedList: any[] = [];

  @ViewChild(SamSortDirective) sort: SamSortDirective;

  ngOnChanges() {
    this.dataChange.next(this.dataSource);
    if (this.samTableDataSource) {
      this.samTableDataSource.filter = this.filterText;
    }
  }
  ngAfterViewInit() {
    this.samTableDataSource = new SampleDataSource(
      this.dataChange,
      this.sort
    );
  }

  ngOnInit() {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  onChecked(ev, row) {
    if (ev.target.checked) {
      this.selectedList = [...this.selectedList, row];
    } else {
      const index: number = this.selectedList.indexOf(row);
      if (index !== -1) {
        this.selectedList = this.selectedList.filter(item => item !== row);
      }
    }
  }

  isSelected(item: any) {
    return this.selectedItem ?
      this.focusedCell.id == item.id : false;
  }
  public onChangeLevel(ev: Event, item: GridItem): void {
    this.levelChanged.emit(item);

  }
  onRowChange(ev, row) {
    console.log(ev, 'row changed');
    if (ev.target.type !== 'checkbox') {

      this.selectedList = [];
      this.rowChanged.emit(row['id']);
    }
  }
}

export class SampleDataSource extends DataSource<any> {
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
