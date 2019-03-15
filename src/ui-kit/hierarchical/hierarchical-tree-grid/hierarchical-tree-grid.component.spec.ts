import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk';
import { SamDataTableModule } from '../../components/data-table';
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
    gridColumnsDisplayed: [],
    primaryKeyField: 'id',
    childCountField: 'childCount',
    navigateScreenReaderText: '',
    primaryTextField: '',
    emptyResultText: ''
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
            component.gridData = [gridData[0]];
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


        it('Scroll raised', () => {
            spyOn(component.scrolled, 'emit');
            let item = {
                target: {
                    offsetHeight: 300,
                    scrollTop: 400,
                    scrollHeight: 500
                }
            }
            component.onScroll(item);
            fixture.detectChanges();
            expect(component.scrolled.emit).toHaveBeenCalledWith(null);
        });

        it('Scroll not raised', () => {
            spyOn(component.scrolled, 'emit');
            let item = {
                target: {
                    offsetHeight: 300,
                    scrollTop: 0,
                    scrollHeight: 700
                }
            }
            component.onScroll(item);
            fixture.detectChanges();
            expect(component.scrolled.emit).not.toHaveBeenCalled();
        });

    });

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
            component.dataChange.next(gridData);

            const dataSource = new HierarchicalDataSource(
                component.dataChange

            );
            dataSource.connect();
            expect(dataSource.renderedData.length).toBe(0);

        });


    });
});

