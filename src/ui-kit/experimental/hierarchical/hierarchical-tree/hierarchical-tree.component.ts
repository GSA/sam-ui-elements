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

  public selecteHierarchyLevel = new BehaviorSubject<object>(null);
  public selectResults$ = new BehaviorSubject<object[]>([]);
  public filterTextSubject = new BehaviorSubject<string>("");
  public selectBreadcrumb = new BehaviorSubject<string>(null);

  public results: object[];

  public gridResults: Observable<object[]>;

  private filterText: string;

  private selectedValue: string;


  /**
   * 
   */
  @Input() service: SamHiercarchicalServiceInterface;

  /**
  * hierarchy tree picker configurations 
  */
  @Input() configuration: SamHierarchicalTreeConfiguration;

  constructor() { }

  private breadcrumbStack: object[] = [];
  private breadcrumbStackSelectable: object[] = [];


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

  public breadcrumbSelected(value: string) {
    let item = this.breadcrumbStack.find(itm => itm[this.configuration.primaryKey] === value);
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

  private addInitialBreadcrumb(): void {
    const breadCrumbItem = {};
    breadCrumbItem["name"] = "All Departments";
    breadCrumbItem["id"] = null;
    breadCrumbItem["value"] = null;
    breadCrumbItem["label"] = "All Departments";
    this.breadcrumbStackSelectable.unshift(breadCrumbItem);
  }

  public selectItem(value: object) {
    this.filterText = '';
    if (value) {
      this.selectedValue = value[this.configuration.primaryKey];
    } else {
      this.selectedValue = null;
    }
    this.createBreadcrumb(value);
    this.getResults();
  }

  private createBreadcrumb(value: object) {
    const breadCrumbItem = {};
    if (value) {
      breadCrumbItem["name"] = value["name"];
      breadCrumbItem["id"] = value[this.configuration.primaryKey];
      breadCrumbItem["value"] = value[this.configuration.primaryKey];
      breadCrumbItem["label"] = value["name"];
    }
    let breadcrumbStackPostion = this.breadcrumbStack.indexOf(breadCrumbItem);
    if (breadcrumbStackPostion === -1 && value) {
      this.breadcrumbStackSelectable.unshift(breadCrumbItem);
      this.breadcrumbStack.unshift(value);
    }
  }

  getResults() {
    this.gridResults = this.service.getHiercarchicalById(this.selectedValue, this.filterText);
  }



}
