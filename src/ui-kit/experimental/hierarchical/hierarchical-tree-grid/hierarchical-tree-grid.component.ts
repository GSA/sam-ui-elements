import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SamSortDirective } from '../../../components'
import { HierarchicalDataSource } from './data-source';

export interface GridTemplate {
}

export interface GridTemplateConfiguration {
  gridDisplayedColumn: GridDisplayedColumn[]
  primaryKey: string;
}

export interface GridDisplayedColumn {
  headerText: string, 
  fieldName: string,
  displayOrder: number
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
  public columnFieldName = [];
  public columnHeaderText = [];
  public selectedList: object[] = [];
  public hierarchicalDataSource: HierarchicalDataSource | null;
  public dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  @ViewChild(SamSortDirective) sort: SamSortDirective;

  constructor (private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.dataChange.next(this.gridData);
    if (this.hierarchicalDataSource) {
      this.hierarchicalDataSource.filter = this.filterText;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.templateConfigurations.gridDisplayedColumn.forEach(item => {
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
      this.selectedList = [];
      this.rowChanged.emit(row[this.templateConfigurations.primaryKey]);
    }
  }
}