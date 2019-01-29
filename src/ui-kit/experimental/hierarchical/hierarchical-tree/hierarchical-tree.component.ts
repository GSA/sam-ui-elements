import { Component, OnInit, Input } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { SamHiercarchicalServiceInterface } from "../hierarchical-interface";
import { SamHierarchicalTreeConfiguration } from "../models/SamHierarchicalTreeConfiguration";

@Component({
  selector: "sam-hierarchical-tree",
  templateUrl: "./hierarchical-tree.component.html",
  styleUrls: ["./hierarchical-tree.component.scss"]
})

export class SamHierarchicalTreeComponent implements OnInit {

  /**
   * Hierarchy level changes event 
   */
  public selecteHierarchyLevel = new BehaviorSubject<object>(null);

  /**
   * Event when something is checked/selected in the grid
   */
  public selectResults$ = new BehaviorSubject<object[]>([]);

  /**
   * Filter change event handler
   */
  public filterTextSubject = new BehaviorSubject<string>("");

  /**
   * Event for when breadcrumb item is selected
   */
  public selectBreadcrumb = new BehaviorSubject<string>(null);

  /**
   * Items selected 
   */
  public results: object[];

  /**
   * Observable Results for the grid
   */
  public gridResults: Observable<object[]>;

  /**
   * Filter text
   */
  private filterText: string;

  /**
   * Selected Values Primiary Id
   */
  public selectedValue: string;

  /**
   * is single mode if a single or multiple item selection
   */
  @Input() public isSingleMode: boolean;


  /**
   * Copy of the service
   */
  @Input() service: SamHiercarchicalServiceInterface;

  /**
  * hierarchy tree picker configurations 
  */
  @Input() configuration: SamHierarchicalTreeConfiguration;


  /**
   * selected items from service in the breadcrumb
   */
  breadcrumbStack: object[] = [];

  /**
   * List of breadcrumb items that will display in the breadcrumb
   */
  breadcrumbStackSelectable: object[] = [];

  public ngOnInit() {
    this.addInitialBreadcrumb();
    this.selecteHierarchyLevel.subscribe(
      value => this.selectItem(value)
    );
    this.selectBreadcrumb.subscribe(
      value => {
        this.breadcrumbSelected(value);
      }
    );
    this.selectResults$.subscribe(
      res => {
        this.setSelectedResults(res);
      }
    );
    this.filterTextSubject.subscribe(
      text => {
        this.filterText = text;
        this.getResults();
      }
    );
  }

  /**
   * Sets the selected items 
   * @param res 
   */
  private setSelectedResults(res: any) {
    this.results = [];
    this.results = res;
  }

  /**
   * Selects a breadcrum and remove all crumbs above it in the stack
   * @param value 
   */
  public breadcrumbSelected(value: string) {
    let item = this.breadcrumbStack.find(itm => itm[this.configuration.primaryKeyField] === value);
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

  /**
   * Creates the top level breadcrumb 
   */
  private addInitialBreadcrumb(): void {
    const breadCrumbItem = {};
    breadCrumbItem["name"] = this.configuration.topLevelBreadcrumbText;
    breadCrumbItem["id"] = null;
    breadCrumbItem["value"] = null;
    breadCrumbItem["label"] = this.configuration.topLevelBreadcrumbText;
    this.breadcrumbStackSelectable.unshift(breadCrumbItem);
  }

  /**
   *  Selects a new item
   * @param value 
   */
  public selectItem(value: object) {
    this.filterText = '';
    let selected = null;
    if (value) {
      selected = value[this.configuration.primaryKeyField];
    }
    this.createBreadcrumb(value);
    this.selectedValue = selected;
    this.getResults();
  }

  /**
   * Creats a new breadcrumb item and adds a new breadcrumb
   * @param value 
   */
  private createBreadcrumb(value: object) {
    const breadCrumbItem = {};
    if (value) {
      breadCrumbItem["name"] = value[this.configuration.primaryTextField];
      breadCrumbItem["id"] = value[this.configuration.primaryKeyField];
      breadCrumbItem["value"] = value[this.configuration.primaryKeyField];
      breadCrumbItem["label"] = value[this.configuration.primaryTextField];
    }
    let breadcrumbStackPostion = this.breadcrumbStack.indexOf(breadCrumbItem);
    if (breadcrumbStackPostion === -1 && value) {
      this.breadcrumbStackSelectable.unshift(breadCrumbItem);
      this.breadcrumbStack.unshift(value);
    }
  }

  /**
   * Calls the provided service to get the results for the girdbased on
   * the primary id of the selected   * and the filter
   */
  private getResults() {
    this.gridResults = this.service.getHiercarchicalById(this.selectedValue, this.filterText);
  }
}
