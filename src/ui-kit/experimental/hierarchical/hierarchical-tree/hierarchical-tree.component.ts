import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { Observable, BehaviorSubject } from 'rxjs';


export interface HierarchyConfiguration {
  displayedColumns: any[],
  primaryKey: string,
  options: OptionsType[],
  gridData: any[],
  filterText: string
}

@Component({
  selector: 'sam-hierarchical-tree',
  templateUrl: './hierarchical-tree.component.html',
  styleUrls: ['./hierarchical-tree.component.scss']
})

export class SamHierarchicalTreeComponent implements OnInit {

  public selectedAgency$ = new BehaviorSubject<any>(null);
  public selectResults$ = new BehaviorSubject<any[]>([]);
  public filterText$ = new BehaviorSubject<any>('');
  /**
  * hierarchy tree picker configurations 
  */
  @Input() hierarchyConfiguration: HierarchyConfiguration;

  /**
  * Data for the Table.
  *  Observable data array
  * Stream that emit a array each time when the item is selected.
  * Stream that changes each time when click action trigger on row.
  */
  @Input() gridData: Observable<any>;

  /**
  * Event emitted when row is clicked
  */
  @Output() public rowChanged = new EventEmitter<any>();

  /**
  * Event emitted when level change is clicked
  */
  @Output() public selectedAgency = new EventEmitter<string>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<any[]>();


  public ngOnInit() {
    this.selectedAgency$.subscribe(
      value => this.selectedAgency.emit(value)
    );
    this.selectResults$.subscribe(
      res => this.selectResults.emit(res)
    );
    this.filterText$.subscribe(
      text => this.hierarchyConfiguration.filterText = text);
  }

}
