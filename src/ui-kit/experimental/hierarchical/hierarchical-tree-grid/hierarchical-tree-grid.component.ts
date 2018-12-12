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
   this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  ngOnInit() {
    this.dataChange.next(this.dataSource);
    this.samTableDataSource = new SampleDataSource(
      this.dataChange,
      this.paginator,
      this.sort
    );
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
      this.renderedData = sortedData;
      return this.renderedData;
    });
  }
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): any {
  //   const active = this._sort.active;
  //   const direction = this._sort.direction;
  //    if (!active) { return data; }
  //  return data.sort((a, b) => {
  //   let propertyA: number|string = '';
  //   let propertyB: number|string = '';


  //   let comparatorResult = 0;
  //   if (propertyA != null && propertyB != null) {
  //     // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
  //     if (propertyA > propertyB) {
  //       comparatorResult = 1;
  //     } else if (propertyA < propertyB) {
  //       comparatorResult = -1;
  //     }
  //   } else if (propertyA != null) {
  //     comparatorResult = 1;
  //   } else if (propertyB != null) {
  //     comparatorResult = -1;
  //   }
  //   return comparatorResult * (direction == 'asc' ? 1 : -1);
  //   });
  return data;
  }

  getSortedData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === '') { return data; }
    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';
      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a['id'], b['id']]; break;
        case 'name': [propertyA, propertyB] = [a['name'], b['name']]; break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}


