import {
  Component, OnInit, ViewChild, Input,
  Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SamSortDirective } from '../../../components'
import { HierarchicalDataSource } from './data-source';
import { SamHierarchicalTreeGridConfiguration } from '../models/SamHierarchicalTreeGridConfiguration';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {

  /**
  * Table configurations 
  */
  @Input() public configuration: SamHierarchicalTreeGridConfiguration;

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
  public columnFieldName = [];
  public columnHeaderText = [];
  public selectedList: object[] = [];
  public hierarchicalDataSource: HierarchicalDataSource | null;
  public dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  @ViewChild(SamSortDirective) sort: SamSortDirective;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.dataChange.next(this.gridData);
  }

  ngOnInit() {
    this.configuration.gridDisplayedColumn.forEach(item => {
      this.columnFieldName.push(item.fieldName);
      this.columnHeaderText.push(item.headerText);
    });
    this.displayedColumns = [...this.displayedColumns, ...this.columnFieldName];
  }

  ngAfterViewInit() {
    this.hierarchicalDataSource = new HierarchicalDataSource(
      this.dataChange,
      this.sort
    );
    this.cdr.detectChanges();
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
  public onChangeLevel(ev, item: object): void {
    this.levelChanged.emit(item);
  }

  /**
  * when the row is click updates the table data
  */
  onRowChange(ev, row): void {
    if (ev.target.type !== 'checkbox') {
      if (row[this.configuration.childCountField] > 0) {
        this.selectedList = [];
        this.rowChanged.emit(row);
      }
    }
  }
}
