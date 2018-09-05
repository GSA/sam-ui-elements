import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
Component,
Output,
ViewChild,
EventEmitter
} from '@angular/core';
import {CdkTableModule} from '@angular/cdk';

import { SamDataTableModule,SamSortDirective } from './';
import { ExampleDataSource,ExampleDatabase } from './data-source.sample.spec';

@Component({
    selector: 'test-cmp',
    template: `
<sam-datatable #table samSort [dataSource]="dataSource">
    <!-- Column Definition: agency -->
    <ng-container cdkColumnDef="agency">
        <sam-header-cell *cdkHeaderCellDef sam-sort-header>
            Agency
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.agency}} </sam-cell>
    </ng-container>

    <!-- Column Definition: cfdaNumber -->
    <ng-container cdkColumnDef="cfdaNumber">
        <sam-header-cell *cdkHeaderCellDef sam-sort-header>CFDA #
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.cfdaNumber}} </sam-cell>
    </ng-container>

    <!-- Column Definition: title -->
    <ng-container cdkColumnDef="title">
        <sam-header-cell *cdkHeaderCellDef sam-sort-header>
            Title
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.title}} </sam-cell>
    </ng-container>

    <!-- Column Definition: status -->
    <ng-container cdkColumnDef="status">
        <sam-header-cell *cdkHeaderCellDef sam-sort-header>
            Status
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.status}} </sam-cell>
    </ng-container>

    <!-- Column Definition: cost -->
    <ng-container cdkColumnDef="cost">
        <sam-header-cell *cdkHeaderCellDef sam-sort-header>
            Cost
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.cost}} </sam-cell>
    </ng-container>

    <!-- Column Definition: lastUpdatedDate -->
    <ng-container cdkColumnDef="lastUpdatedDate">
        <sam-header-cell *cdkHeaderCellDef>
            Last Updated
        </sam-header-cell>
        <sam-cell *cdkCellDef="let row"> {{row.lastUpdatedDate}} </sam-cell>
    </ng-container>

    <sam-header-row *cdkHeaderRowDef="displayedColumns"></sam-header-row>
    <sam-row *cdkRowDef="let row; columns: displayedColumns;
        let first = first; let last = last; let even = even; let odd = odd">
    </sam-row>
</sam-datatable>
    `
})
class TestComponent {
    exampleDatabase = new ExampleDatabase();
    dataSource: ExampleDataSource | null;
    @ViewChild(SamSortDirective) sort: SamSortDirective;
    ngOnInit(){
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
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
});
