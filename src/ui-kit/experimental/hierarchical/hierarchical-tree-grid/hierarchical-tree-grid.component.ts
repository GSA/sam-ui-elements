import {
  Component, OnInit, ViewChild, Input, AfterViewChecked,
  Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SamSortDirective } from '../../../components'
import { HierarchicalDataSource } from './data-source';
import { SamHierarchicalTreeGridConfiguration } from '../models/SamHierarchicalTreeGridConfiguration';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit, AfterViewChecked {

  /**
  * Table configurations 
  */
  @Input() public configuration: SamHierarchicalTreeGridConfiguration;

  /**
   * Data for the grid
   */
  @Input() public gridData: object[] = [];

  /**
   * Mode to determine if single or multiple selection
   */
  @Input() public isSingleMode: boolean;

  /**
   * Row change event
   */
  @Output() public rowChanged = new EventEmitter<object>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<object[]>();

  /**
   * 
   */
  @Output() public sorted = new EventEmitter<object>();

  /**
   * 
   */
  @Output() public scrolled = new EventEmitter<object>();

  /**
   * Columns to be displayed
   */
  public displayedColumns = ['select'];

  /**
   * column fields that will display for each column 
   */
  public columnFieldName = [];

  /**
   * Column header text list
   */
  public columnHeaderText = [];

  /**
   * List of the items selected by the checkboxes or the radio buttons
   */
  public selectedList: object[] = [];

  /**
   * Hierarchical data source
   */
  public hierarchicalDataSource: HierarchicalDataSource | null;

  /**
   * event called when data changed
   */
  public dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

  /**
   * Selection mode default is checkbox
   */
  selectionMode: string = "checkbox";

  /**
   * Sort Directive
   */
  @ViewChild(SamSortDirective, {static: true}) sortDirective: SamSortDirective;


  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.dataChange.next(this.gridData);
  }

  ngOnInit() {
    this.configuration.gridColumnsDisplayed.forEach(item => {
      this.columnFieldName.push(item.fieldName);
      this.columnHeaderText.push(item.headerText);
    });
    this.displayedColumns = [...this.displayedColumns, ...this.columnFieldName];

  }

  ngAfterViewChecked(): void {
    if (this.isSingleMode) {
      this.selectionMode = "radio";
      this.cdr.detectChanges();
    }  
  }

  ngAfterViewInit() {
    this.hierarchicalDataSource = new HierarchicalDataSource(this.dataChange);
    if (this.sortDirective) {
      this.sortDirective.samSortChange.subscribe(
        value => {
          this.sorted.emit(value);
        }
      );
    }
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


  onScroll(event) {
    let scrollAreaHeight = event.target.offsetHeight;
    let scrollTopPos = event.target.scrollTop;
    let scrollAreaMaxHeight = event.target.scrollHeight;
    if ((scrollTopPos + scrollAreaHeight * 2) >= scrollAreaMaxHeight) {
      this.scrolled.emit(null);
    }
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
