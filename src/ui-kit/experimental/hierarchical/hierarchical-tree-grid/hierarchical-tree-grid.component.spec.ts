import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk';
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { SamHierarchicalTreeGridComponent } from './hierarchical-tree-grid.component';
import { SamHierarchicalTreeGridConfiguration } from '../models/SamHierarchicalTreeGridConfiguration';

import {
    ChangeDetectorRef
} from '@angular/core/src/change_detection/change_detector_ref';
import { HierarchicalDataSource } from './data-source';

const gridData = [
    { 'id': '1', 'parentId': 'null', 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1', 'childCount': 1 },
    { 'id': '2', 'parentId': '1', 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 2', 'childCount': 1 },
    { 'id': '3', 'parentId': '2', 'name': 'Level 3', 'subtext': 'id 3', 'type': 'Level 3', 'childCount': 1 },
    { 'id': '4', 'parentId': '3', 'name': 'Level 4', 'subtext': 'id 4', 'type': 'Level 4', 'childCount': 1 },
    { 'id': '5', 'parentId': '4', 'name': 'Level 5', 'subtext': 'id 5', 'type': 'Level 5', 'childCount': 1 },
    { 'id': '6', 'parentId': '5', 'name': 'Level 6', 'subtext': 'id 6', 'type': 'Level 6', 'childCount': 1 },
    { 'id': '7', 'parentId': '6', 'name': 'Level 7', 'subtext': 'id 7', 'type': 'Level 7', 'childCount': 0 }

];

const config: SamHierarchicalTreeGridConfiguration = {
    gridDisplayedColumn: [],
    primaryKeyField: 'id',
    childCountField: 'childCount'
};
describe('The Sam hierarchical grid component', () => {
    describe('The Sam Data Table Tests', () => {
        let component: SamHierarchicalTreeGridComponent,
            fixture: ComponentFixture<SamHierarchicalTreeGridComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    CdkTableModule,
                    SamDataTableModule
                ],
                declarations: [
                    SamHierarchicalTreeGridComponent
                ],
            });

            fixture = TestBed.createComponent(SamHierarchicalTreeGridComponent);
            component = fixture.componentInstance;
            component.displayedColumns = ['select'];
            component.configuration = config;
            fixture.detectChanges();
            component.ngOnInit();
        });


        it('onChecked checked/unchecked', () => {
            let ev = {
                target: {
                    checked: true
                }
            };
            let row = gridData[6];
            spyOn(component.selectResults, 'emit');
            component.onChecked(ev, row);
            fixture.detectChanges();
            expect(component.selectedList.length).toBe(1);
            expect(component.selectResults.emit).toHaveBeenCalledWith(component.selectedList);
            ev.target.checked = false;
            component.onChecked(ev, row);
            fixture.detectChanges();
            expect(component.selectedList.length).toBe(0);
            expect(component.selectResults.emit).toHaveBeenCalledWith(component.selectedList);
        });


        it('onRowChange has children', () => {
            let ev = {
                target: {
                    type: ''
                }
            };
            let row = gridData[0];
            spyOn(component.rowChanged, 'emit');
            component.onRowChange(ev, row);
            fixture.detectChanges();
            expect(component.selectedList.length).toBe(0);
            expect(component.rowChanged.emit).toHaveBeenCalledWith(row);
        });


        it('onRowChange has no children', () => {

            let ev = {
                target: {
                    type: ''
                }
            };
            let row = gridData[6];
            spyOn(component.rowChanged, 'emit');
            component.onRowChange(ev, row);
            fixture.detectChanges();
            expect(component.selectedList.length).toBe(0);
            expect(component.rowChanged.emit).not.toHaveBeenCalled();

        });

    });
    //     it('should displayedColumns length', function () {
    //         component.configuration.gridDisplayedColumn = [
    //             { headerText: 'Id', fieldName: 'id' },
    //             { headerText: 'Name', fieldName: 'name' },
    //         ];
    //         component.ngOnInit();
    //         fixture.detectChanges();
    //         expect(component.displayedColumns.length).toBe(3);
    //     });

    //     it('should initial datachange length', function () {
    //         component.dataChange.next(gridData);
    //         component.ngOnChanges();
    //         fixture.detectChanges();
    //         expect(component.dataChange.value.length).toBe(0);
    //     });

    //     it('should be datachange length is equal to data length', function () {
    //         component.dataChange.next(gridData);
    //         component.ngAfterViewInit();
    //         fixture.detectChanges();
    //         expect(component.dataChange.value.length).toBe(gridData.length);
    //     });

    //     // it('should be fitler text changes', function () {
    //     //     component.dataChange.next(gridData);

    //     //     component.hierarchicalDataSource = new HierarchicalDataSource(
    //     //         component.dataChange,
    //     //         component.sort
    //     //     );

    //     //     fixture.detectChanges();
    //     //     expect(component.hierarchicalDataSource.renderedData.length).toBe(3);
    //     // });

    //     it('should be datasoruce length grid data length', function () {
    //         component.dataChange.next(gridData);
    //         component.hierarchicalDataSource = new HierarchicalDataSource(
    //             component.dataChange,
    //             component.sort
    //         );
    //         component.ngAfterViewInit();
    //         fixture.detectChanges();
    //         expect(component.hierarchicalDataSource.renderedData.length).toBe(gridData.length);
    //     });

    //     it('should emit on ChangeLevel', function () {
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const mockEvent = {
    //             currentTarget: {
    //                 value: undefined
    //             }
    //         };
    //         component.onChangeLevel(mockEvent, row);
    //         fixture.detectChanges();
    //         component.levelChanged.subscribe((res: any) => {
    //             expect(res).toBe(row);
    //         });
    //     });

    //     it('Should emit primary on row changed', () => {
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'lable'
    //             }
    //         };
    //         component.configuration = config;
    //         component.onRowChange(dummyUpEvent, row);
    //         component.rowChanged.subscribe((res: any) => {
    //             expect(res).toBe(row[component.configuration.primaryKey]);
    //         });
    //     });

    //     it('Should emit primary on row changed', () => {
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox'
    //             }
    //         };
    //         component.configuration = config;
    //         component.rowChanged.subscribe((res: any) => {
    //             expect(res).toBe(row[component.configuration.primaryKey]);
    //         });
    //         component.onRowChange(dummyUpEvent, row);
    //     });

    //     it('Should emit on checkbox selected', () => {
    //         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox',
    //                 checked: true
    //             }
    //         };
    //         component.selectedList = results;
    //         component.configuration = config;
    //         component.onChecked(dummyUpEvent, row);
    //         expect(component.selectedList.length).toBe(2);
    //     });

    //     it('Should emit on checkbox unselected', () => {
    //         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    //         const row = { 'id': '2', 'parentId': 1, 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox',
    //                 checked: false
    //             }
    //         };
    //         component.selectedList = results;
    //         component.configuration = config;
    //         component.onChecked(dummyUpEvent, row);
    //         expect(component.selectedList.length).toBe(1);
    //     });

    //     it('Should emit on checkbox unselected', () => {
    //         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox',
    //                 checked: false
    //             }
    //         };
    //         component.selectedList = results;
    //         component.configuration = config;
    //         fixture.detectChanges();
    //         component.selectResults.subscribe((g) => {
    //             expect(g.length).toBe(1);
    //         });
    //         component.onChecked(dummyUpEvent, row);
    //     });

    //     it('Should emit on checkbox unselected with index', () => {
    //         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox',
    //                 checked: false
    //             }
    //         };
    //         component.selectedList = results;
    //         component.configuration = config;
    //         fixture.detectChanges();
    //         component.selectResults.subscribe((g) => {
    //             expect(g.length).toBe(1);
    //         });
    //         component.onChecked(dummyUpEvent, row);
    //     });


    //     it('Should emit on checkbox unselected', () => {
    //         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    //         const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
    //         const dummyUpEvent = {
    //             preventDefault: function () { },
    //             stopPropagation: function () { },
    //             target: {
    //                 type: 'checkbox',
    //                 checked: true
    //             }
    //         };
    //         component.selectedList = results;
    //         component.selectResults.subscribe((g) => {
    //             expect(g.length).toBe(2);
    //         });
    //         component.onChecked(dummyUpEvent, row);
    //     });
    // });

    describe('Isolation tests', () => {
        let component: SamHierarchicalTreeGridComponent;
        const cdr: ChangeDetectorRef = undefined;
        beforeEach(() => {
            component = new SamHierarchicalTreeGridComponent(cdr);
        });

        it('should be datachange length is equal to data length', function () {
            component.displayedColumns = ['default'];
            expect(component.displayedColumns.length).toBe(1);
            expect(component.hierarchicalDataSource).toBe(undefined);
            expect(component.columnFieldName.length).toBe(0);
            expect(component.dataChange.value.length).toBe(0);
            expect(component.selectedList.length).toBe(0);
            expect(component.columnHeaderText.length).toBe(0);
        });
        it('test', () => {
            const sort: SamSortDirective = new SamSortDirective();
            component.dataChange.next(gridData);

            const dataSource = new HierarchicalDataSource(
                component.dataChange,
                sort
            );
            dataSource.connect();
            expect(dataSource.renderedData.length).toBe(0);

        });
        it('Data Source get Sorted Data', () => {
            const sort: SamSortDirective = new SamSortDirective();
            component.dataChange.next(gridData);

            const dataSource = new HierarchicalDataSource(
                component.dataChange,
                sort
            );
            const result = dataSource.getSortedData(gridData).length;
            expect(result).toBe(gridData.length);
        });
        it('Data Source sorting Data Accessor', () => {
            const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
            const sort: SamSortDirective = new SamSortDirective();
            component.dataChange.next(gridData);

            const dataSource = new HierarchicalDataSource(
                component.dataChange,
                sort
            );
            const result = dataSource.sortingDataAccessor(row, 'id');
            expect(result).toBe(row['id']);
        });

    });
});

