import {
  Component,
  OnInit, ViewChild, ElementRef
} from '@angular/core';
import { SamSortDirective, SamPaginationComponent } from '../../../components'
import { ExampleDatabase, ExampleDataSource } from '../data-source';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})
export class SamHierarchicalTreeGridComponent implements OnInit {

 // pageSize = 10;
  // totalPages = 1;
  displayedColumns = ['agency', 'cfdaNumber', 'title'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  //curPage = 1;
  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
  }
}

