import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
Component,
Output,
Input,
ViewChild,
EventEmitter
} from '@angular/core';
import {CdkTableModule} from '@angular/cdk';
import { SamDataTableModule,SamSortDirective } from '../../../components/data-table';
import { HierarchicalDataSource, GridDisplayedColumn } from './hierarchical-tree-grid.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const gridData = [
  {'id': '1', 'parentId': 'null', 'name': 'Level 6', 'subtext': 'id 4578', 'type': 'Level 6'},
  {'id': '2', 'parentId': '3', 'name': 'Level 7', 'subtext': 'id 4579', 'type': 'Level 7'},
  {'id': '3', 'parentId': '2', 'name': 'Level 6', 'subtext': 'id 4580', 'type': 'Level 6'},
  {'id': '4', 'parentId': '1', 'name': 'Level 7', 'subtext': 'id 4581', 'type': 'Level 7'},
  {'id': '5', 'parentId': '4', 'name': 'Level 4', 'subtext': 'id 4582', 'type': 'Level 4'},
  {'id': '6', 'parentId': '5', 'name': 'Level 5', 'subtext': 'id 4583', 'type': 'Level 5'},
  {'id': '7', 'parentId': '6', 'name': 'Level 3', 'subtext': 'id 4584', 'type': 'Level 3'},
  {'id': '8', 'parentId': '7', 'name': 'Level 2', 'subtext': 'id 4585', 'type': 'Level 2'},
  {'id': '9', 'parentId': '8', 'name': 'Level 1', 'subtext': 'id 4586', 'type': 'Level 1'}
 ];
 
@Component({
    selector: 'test-cmp',
    template: `
    <sam-datatable #table samSort [dataSource]="hierarchicalDataSource">
    <ng-container cdkColumnDef="select">
      <th sam-header-cell *cdkHeaderCellDef sam-sort-header>Select</th>
      <td sam-cell *cdkCellDef="let row">
        <input type="checkbox" id="selectId" (change)="onChecked($event,row)"
          name="select">
        <label for="selectId"></label>
      </td>
    </ng-container>

    <ng-container *ngFor="let col of columnFieldName;let cIndex = index;" cdkColumnDef="{{col}}">
      <th sam-header-cell *cdkHeaderCellDef sam-sort-header>
       {{columnHeaderText[cIndex]}}
      </th>
      <td sam-cell *cdkCellDef="let row; let rIndex = index;"> {{row[col]}} </td>
    </ng-container>

    <tr sam-header-row *cdkHeaderRowDef="displayedColumns"></tr>
    <tr (click)="onRowChange($event,row)" sam-row *cdkRowDef="let row; columns: displayedColumns;
      let first = first; let last = last; let even = even; let odd = odd"></tr>
  </sam-datatable>
    `
})
class TestComponent {
  @Input() gridDisplayedColumn: GridDisplayedColumn[] = [];
  public displayedColumns = ['select'];
  public columnFieldName =[];
  public columnHeaderText = [];
  dataChange: BehaviorSubject<object[]> = new BehaviorSubject<object[]>(gridData);
  hierarchicalDataSource:  HierarchicalDataSource | null;
    @ViewChild(SamSortDirective) sort: SamSortDirective;
    ngOnInit(){
        this.hierarchicalDataSource = new HierarchicalDataSource(this.dataChange, this.sort);
        this.gridDisplayedColumn.forEach(item =>{
          this.columnFieldName.push(item.fieldName);
          this.columnHeaderText.push(item.headerText);
        })
        this.displayedColumns = [...this.displayedColumns,...this.columnFieldName]

    }

}

describe('The Sam Data Table Tests', () => {
    let component: TestComponent, 
        fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CdkTableModule,
                SamDataTableModule
            ],
            declarations: [
                TestComponent
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile`', function () {
        expect(true).toBe(true);
    });
    it('should displayedColumns length', function () {
        component.gridDisplayedColumn = [
            { headerText: 'Id',  fieldName: 'id' , displayOrder: 1},
            { headerText: 'Name',  fieldName: 'name' , displayOrder: 2},
        ]
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.displayedColumns.length).toBe(3);
    });
    it('should not be displayedColumns length', function () {
        component.gridDisplayedColumn = [
            { headerText: 'Id',  fieldName: 'id' , displayOrder: 1},
            { headerText: 'Name',  fieldName: 'name' , displayOrder: 2},
        ]
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.displayedColumns.length).not.toBe(4);
    });

    it('should column Field Name length', function () {
        component.gridDisplayedColumn = [
            { headerText: 'Id',  fieldName: 'id' , displayOrder: 1},
            { headerText: 'Name',  fieldName: 'name' , displayOrder: 2},
        ]
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.columnFieldName.length).toBe(component.gridDisplayedColumn.length);
    });
});
