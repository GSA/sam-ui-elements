import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

export interface GridTemplate {
}

export interface GridTemplateConfiguration {
  displayedColumns: any[];
  primaryKey: string
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
  @Input() public samDataSource : any | null;
  /**
 * Event emitted when level change is clicked
 */
  @Output() public levelChanged = new EventEmitter<GridItem>();

  /**
 * Event emitted when row is clicked
 */
  @Output() public rowChanged = new EventEmitter<GridItem>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<any[]>();

  public displayedColumns = ['select'];

  public selectedList: any[] = [];

  ngOnChanges() {
    if (this.samDataSource) {
      this.samDataSource.filter = this.filterText;
    }
  }

  ngOnInit() {
    this.displayedColumns = [...this.displayedColumns, ...this.templateConfigurations.displayedColumns];
  }

  /**
   * On select the results
   */
  onChecked(ev, row) {
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
  public onChangeLevel(ev: Event, item: GridItem): void {
    this.levelChanged.emit(item);

  }
  /**
  * when the row is click updates the table data
  */
  onRowChange(ev, row) {
    if (ev.target.type !== 'checkbox') {
      this.selectedList = [];
      this.rowChanged.emit(row[this.templateConfigurations.primaryKey]);
    }
  }
}
