import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { Observable, BehaviorSubject } from 'rxjs';
import { GridDisplayedColumn } from '../hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';

export interface HierarchyConfiguration {
  gridDisplayedColumn: GridDisplayedColumn[],
  primaryKey: string,
  options: OptionsType[],
  filterPlaceholder: string,
  topLevelText: string;
}

@Component({
  selector: 'sam-hierarchical-tree',
  templateUrl: './hierarchical-tree.component.html',
  styleUrls: ['./hierarchical-tree.component.scss']
})

export class SamHierarchicalTreeComponent implements OnInit {

  public selecteHierarchyLevel = new BehaviorSubject<string>(null);
  public selectResults$ = new BehaviorSubject<object[]>([]);
  public filterTextSubject = new BehaviorSubject<string>('');
  public results: object[];


  private selectedResults: object[];
  private filterText: string;
  private selectedValue:string;



  @Input() service: SamHiercarchicalServiceInterface;

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
  @Input() gridData: object[];
  /**
  * Event emitted when row is clicked
  */
  @Output() public rowChanged = new EventEmitter<object>();

  /**
  * Event emitted when level change is clicked
  */
  @Output() public selectedAgency = new EventEmitter<string>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<object[]>();


  public ngOnInit() {

    // .pipe(
    //   switchMap(id => this.service.getHiercarchicalById(id)),    );

    this.selecteHierarchyLevel.subscribe(
      //clear out the filter
      value => this.service.getHiercarchicalById(value,this.filterText)
      
      //this.selectedAgency.emit(value)
    );
    this.selectResults$.subscribe(
      res => {
        this.results = [];
        this.results = res;
      }
    );
    this.filterTextSubject.subscribe(
      text => this.filterText = text
      );
  }

  onSelect(): void {
    this.selectResults.emit(this.results)
  }

}
