import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
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

  public gridResults: Observable<object[]>;


  private selectedResults: object[];
  private filterText: string;
  private selectedValue: string;


  /**
   * 
   */
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
  //@Input() 
  gridData: object[];
  /**
  * Event emitted when row is clicked
  */
  //@Output() public rowChanged = new EventEmitter<object>();

  /**
  * Event emitted when level change is clicked
  */
  //@Output() public selectedAgency = new EventEmitter<string>();

  /**
  * Event emitted when row set is selected.
  */
  @Output() selectResults = new EventEmitter<object[]>();

  constructor(private cdr: ChangeDetectorRef) { }

  public ngOnInit() {

    this.selecteHierarchyLevel.subscribe(
      value => {

        //clearFilter

        if (value) {
          this.selectedValue = value[this.hierarchyConfiguration.primaryKey];
        } else {
          this.selectedValue = null;
        }

        console.log('SamHierarchicalTreeComponent')
        console.log(value);
        console.log(this.selectedValue);
        this.getResults();
      }

    );
    this.selectResults$.subscribe(
      res => {
        this.results = [];
        this.results = res;
      }
    );
    this.filterTextSubject.subscribe(
      text => {
        this.filterText = text;
        this.getResults();
      }
    );
  }

  onSelect(): void {
    this.selectResults.emit(this.results)
  }


  getResults() {
    this.gridResults = this.service.getHiercarchicalById(this.selectedValue, this.filterText);
    this.cdr.detectChanges();
    this.gridResults.subscribe(
   
          (result) => {
    //       this.gridData = result;
      console.log('New Results');
      console.log(this.gridData);
      this.cdr.detectChanges();

      });
  }



}
