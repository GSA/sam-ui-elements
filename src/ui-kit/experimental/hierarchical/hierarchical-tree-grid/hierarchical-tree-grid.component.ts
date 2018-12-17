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
import { KeyHelper } from '../../../../ui-kit/utilities';

export interface GridTemplate {
}

export interface GridTemplateConfiguration {
  displayedColumns: any[];
  type: string
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
  @Input() public dataSource: any;
  @Input() public filterText: string;

  @Output() public itemSelected = new EventEmitter<GridItem>();
  @Output() public levelChanged = new EventEmitter<GridItem>();
  public selectedItem: GridItem;
  public chkSelected: boolean = false;
  selectedItemIndex = 0;

  public displayedColumns = ['select'];
  public samTableDataSource: any | null;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public focusedCell: any;
  public focusedtemIndex = 0;


  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;

  ngOnChanges() {
    this.dataChange.next(this.dataSource);
  }
  ngAfterViewInit() {
    this.samTableDataSource = new SampleDataSource(
      this.dataChange,
      this.paginator,
      this.sort
    );
  }

  ngOnInit() {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  onSelectItem(ev: Event, item: GridItem) {
    this.selectedItem = item;
    this.itemSelected.emit(this.selectedItem);

  }
  handleKeyup(ev) {
    if (KeyHelper.is('tab', event)) {
      return
    }
    if (KeyHelper.is('down', event)) {
      console.log('onDownArrowDown')
    }

    // On up arrow press
    if (KeyHelper.is('up', event)) {
      console.log('onUpArrowDown')
    }

    console.log(ev)
  }

  isSelected(item: any) {
    return this.selectedItem ?
      this.focusedCell.id == item.id : false;
  }
  public onChangeLevel(ev: Event, item: GridItem): void {
    this.levelChanged.emit(item);

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
      this._sort.samSortChange,
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
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}


