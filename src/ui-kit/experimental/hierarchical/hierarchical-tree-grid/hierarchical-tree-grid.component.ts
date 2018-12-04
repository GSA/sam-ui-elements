import {
  Component,
  OnInit, ViewChild, ElementRef
} from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { SamSortDirective, SamPaginationComponent } from '../../../components'
import { SampleData } from '../data';

export interface ProgramData {
  'Agency': string;
  'CFDANumber': string;
  'Title': string ;
  'CurrentStatus': string;
  'LastUpdatedDate': string;
  'ObligationsUpdated': string;
  'OMBReviewDate': string;
  'LastPublishedDate': string;
  'AutoPublished': string;
}

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})

export class SamHierarchicalTreeGridComponent implements OnInit {

  sampleDisplayedColumns: string[] = ['Agency', 'Title', 'CFDANumber'];
  sampleDataSource = new SampleDataSource();

  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
  }
}

export class SampleDataSource extends DataSource<ProgramData> {

  data = new BehaviorSubject<ProgramData[]>(SampleData);
  connect(): Observable<ProgramData[]> {
    return this.data;
  }

  disconnect() { }
}

