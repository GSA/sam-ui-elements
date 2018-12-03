import {
  Component,
  OnInit,
} from '@angular/core';
import { ExampleDataSource, ExampleDatabase } from './data-source';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {
  displayedColumns = [];
 
  dataSource: any | null;


  constructor() { }

  ngOnInit() {
this.connect();
   
    }

  public connect() {
    this.displayedColumns = [
      'Agency',
      'CFDANumber',
      'Title',
      'CurrentStatus',
      'LastUpdatedDate',
      'ObligationsUpdated',
      'OMBReviewDate',
      'LastPublishedDate',
      'AutoPublished'
    ];
     this.dataSource = [
      {
        'Agency': 'Department Of Agriculture/Agricultural Research Service',
        'CFDA Number': 10.001,
        'Title': 'Agricultural Research_Basic and Applied Research',
        'Current Status': 'Published',
        'Last Updated Date': 'Nov 08, 2016',
        'Obligations Updated': 'No',
        'OMB Review Date': 'Oct 30, 2008',
        'Last Published Date': 'Oct 30, 2008',
        'Auto Published': 'No'
      },
      {
        'Agency': 'Department Of Agriculture',
        'CFDA Number': 10.001,
        'Title': 'Sale of Federal Surplus Personal Property (title change)',
        'Current Status': 'Published',
        'Last Updated Date': 'Dec 05, 2011',
        'Obligations Updated': 'No',
        'OMB Review Date': 'Jun 16, 2009',
        'Last Published Date': 'Jun 16, 2009',
        'Auto Published': 'No'
      },
      {
        'Agency': 'Department Of Agriculture/Forest Service',
        'CFDA Number': 10.003,
        'Title': 'Water Pollution',
        'Current Status': 'Published',
        'Last Updated Date': 'Apr 19, 2016',
        'Obligations Updated': 'No',
        'OMB Review Date': 'Nov 18, 2011',
        'Last Published Date': 'Nov 30, 2011',
        'Auto Published': 'No'
      }];
  
  }
}

