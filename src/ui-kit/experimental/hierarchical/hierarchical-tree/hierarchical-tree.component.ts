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

import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { SamHierarchicalTreeConfiguration } from '../models/SamHierarchicalTreeConfiguration';


@Component({
  selector: 'sam-hierarchical-tree',
  templateUrl: './hierarchical-tree.component.html',
  styleUrls: ['./hierarchical-tree.component.scss']
})

export class SamHierarchicalTreeComponent implements OnInit {

  public selecteHierarchyLevel = new BehaviorSubject<object>(null);
  public selectResults$ = new BehaviorSubject<object[]>([]);
  public filterTextSubject = new BehaviorSubject<string>('');
  public selectBreadcrumb = new BehaviorSubject<string>(null);

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
  @Input() hierarchyConfiguration: SamHierarchicalTreeConfiguration;

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

  private breadcrumbStack: object[] = [];
  private breadcrumbStackSelectable: object[] = [];


  public ngOnInit() {
    this.addInitialBreadcrumb();
    this.selecteHierarchyLevel.subscribe(
      value => this.selectItem(value)

    );

    this.selectBreadcrumb.subscribe(
      value => {
        let item = this.breadcrumbStack.find(itm => itm[this.hierarchyConfiguration.primaryKey] === value);
        let pos = this.breadcrumbStack.indexOf(item);
        if (pos === -1) {
          pos = this.breadcrumbStack.length;
        }
        for (let i = 0; i <= pos; i++) {
          this.breadcrumbStack.shift();
          this.breadcrumbStackSelectable.shift();
        }
        this.selectItem(item);
        if (this.breadcrumbStackSelectable.length === 0) {
          this.addInitialBreadcrumb();
        }
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

  private addInitialBreadcrumb(): void {
    const breadCrumbItem = {};
    breadCrumbItem['name'] = "All Departments";
    breadCrumbItem['id'] = null;
    breadCrumbItem['value'] = null;
    breadCrumbItem['label'] = "All Departments";
    this.breadcrumbStackSelectable.unshift(breadCrumbItem);
  }

  selectItem(value: object) {
    if (value) {
      this.selectedValue = value[this.hierarchyConfiguration.primaryKey];
    } else {
      this.selectedValue = null;
    }
    const breadCrumbItem = {};
    if (value) {
      breadCrumbItem['name'] = value['name'];
      breadCrumbItem['id'] = value[this.hierarchyConfiguration.primaryKey];
      breadCrumbItem['value'] = value[this.hierarchyConfiguration.primaryKey];
      breadCrumbItem['label'] = value['name'];
    }
    let breadcrumbStackPostion = this.breadcrumbStack.indexOf(breadCrumbItem);
    if (breadcrumbStackPostion === -1 && value) {
      this.breadcrumbStackSelectable.unshift(breadCrumbItem);
      this.breadcrumbStack.unshift(value);
    }
    this.getResults();
  }

  onSelect(): void {
    this.selectResults.emit(this.results)
  }


  getResults() {
    this.gridResults = this.service.getHiercarchicalById(this.selectedValue, this.filterText);
  }



}
