import {
  Component,
  OnInit, ViewChild, ElementRef,Input
} from '@angular/core';
import { SamSortDirective, SamPaginationComponent } from '../../../components'
import { ExampleDatabase, ExampleDataSource } from '../data-source';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';

@Component({
  selector: 'sam-hierarchical-tree-grid',
  templateUrl: './hierarchical-tree-grid.component.html',
  styleUrls: ['./hierarchical-tree-grid.component.scss']
})

export class SamHierarchicalTreeGridComponent implements OnInit {
  @Input()
  public service: SamHiercarchicalServiceInterface;

  displayedColumns = ['cfdaNumber','agency',  'title'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  @ViewChild(SamPaginationComponent) paginator: SamPaginationComponent;
  @ViewChild(SamSortDirective) sort: SamSortDirective;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.service.getDataByText(null).subscribe(
      (data) => {
        console.log("Null get data by text");
        console.log(data);
      });
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
  }
}
