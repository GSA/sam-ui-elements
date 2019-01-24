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
   * 
   */
  @Input() public gridData: object[] = [];

  /**
   * 
   */
  @Input() public isSingleMode: boolean;



  /**
   * 
   */
  @Output() public rowChanged = new EventEmitter<object>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<object[]>();

  /**
   * 
   */
  public displayedColumns = ['select'];

  /**
   * 
   */
  public columnFieldName = [];

  /**
   * 
   */
  public columnHeaderText = [];

  /**
   * 
   */
  public selectedList: object[] = [];

  /**
   * 
   */
  public hierarchicalDataSource: HierarchicalDataSource | null;

  /**
   * 
   */
  public dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

  /**
   * 
   */
  selectionMode: string = "checkbox";

  /**
   * 
   */
  @ViewChild(SamSortDirective) sort: SamSortDirective;

  /**
   * 
   * @param cdr 
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * 
   */
  ngOnChanges() {
    this.dataChange.next(this.gridData);
  }

  /**
   * 
   */
  ngOnInit() {
    this.configuration.gridColumnsDisplayed.forEach(item => {
      this.columnFieldName.push(item.fieldName);
      this.columnHeaderText.push(item.headerText);
    });
    this.displayedColumns = [...this.displayedColumns, ...this.columnFieldName];
    if (this.isSingleMode) {
      this.selectionMode = "radio";
    }
  }

  /**
   * 
   */
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
      if (this.isSingleMode) {
        this.selectedList = [row];
      } else {
        this.selectedList = [...this.selectedList, row];
      }
    } else {
      const index: number = this.selectedList.indexOf(row);
      if (index !== -1) {
        this.selectedList = this.selectedList.filter(item => item !== row);
      }
    }
    this.selectResults.emit(this.selectedList);
  }

  /**
  * when the row is click updates the table data
  */
  onRowChange(ev, row): void {
    if (ev.target.type !== 'checkbox' && ev.target.type !== 'radio') {
      if (row[this.configuration.childCountField] > 0) {
        this.selectedList = [];
        this.rowChanged.emit(row);
      }
    }
  }
}
