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
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { HierarchicalDataSource , SamHierarchicalTreeGridComponent, GridTemplateConfiguration } from './hierarchical-tree-grid.component';
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

const config: GridTemplateConfiguration = {
    gridDisplayedColumn: [],
    primaryKey: 'id',
  };

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
        component.templateConfigurations = config;
        fixture.detectChanges();
    });

    it('should displayedColumns length', function () {
        component.templateConfigurations.gridDisplayedColumn = [
            { headerText: 'Id',  fieldName: 'id' , displayOrder: 1},
            { headerText: 'Name',  fieldName: 'name' , displayOrder: 2},
        ];
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.displayedColumns.length).toBe(3);
    });

    it('should initial datachange length', function () {
        component.dataChange.next(gridData);
        component.ngOnChanges();
        fixture.detectChanges();
        expect(component.dataChange.value.length).toBe(0);
    });

    it('should be datachange length is equal to data length', function () {
        component.dataChange.next(gridData);
        component.ngAfterViewInit();
        fixture.detectChanges();
        expect(component.dataChange.value.length).toBe(gridData.length);
    });

    it('should be datasoruce length grid data length', function () {
        component.dataChange.next(gridData);
        component.hierarchicalDataSource = new HierarchicalDataSource(
            component.dataChange,
            component.sort
          );
        component.ngAfterViewInit();
        fixture.detectChanges();
        expect(component.hierarchicalDataSource.renderedData.length).toBe(gridData.length);
    });

    it('Should emit primary on row changed', () => {
        const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
        const dummyUpEvent = {
            preventDefault: function(){},
            stopPropagation: function(){},
            target: {
                type: 'checkbox'
            }
          };
        component.templateConfigurations = config;
        component.rowChanged.subscribe((res: any) => {
          expect(res).toBe(row[component.templateConfigurations.primaryKey]);
        });
        component.onRowChange(dummyUpEvent, row);
      });

      it('Should emit on checkbox selected', () => {
         const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
        const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
        const dummyUpEvent = {
            preventDefault: function(){},
            stopPropagation: function(){},
            target: {
                type: 'checkbox',
                checked : true
            }
          };
          component.selectedList = results;
        component.templateConfigurations = config;
        component.onChecked(dummyUpEvent, row);
        expect(component.selectedList.length).toBe(2);
      });

      it('Should emit on checkbox unselected', () => {
        const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
       const row = { 'id': '2', 'parentId': 1, 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 1' };
       const dummyUpEvent = {
           preventDefault: function(){},
           stopPropagation: function(){},
           target: {
               type: 'checkbox',
               checked : false
           }
         };
         component.selectedList = results;
       component.templateConfigurations = config;
       component.onChecked(dummyUpEvent, row);
       expect(component.selectedList.length).toBe(1);
     });

     it('Should emit primary on row changed', () => {
        const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
        const dummyUpEvent = {
            preventDefault: function(){},
            stopPropagation: function(){},
            target: {
                type: 'lable'
            }
          };
        component.templateConfigurations = config;
        component.onRowChange(dummyUpEvent, row);
        component.rowChanged.subscribe((res: any) => {
          expect(res).toBe(row[component.templateConfigurations.primaryKey]);
        });
      });
      it('Should emit on checkbox unselected', () => {
        const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
       const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
       const dummyUpEvent = {
           preventDefault: function(){},
           stopPropagation: function(){},
           target: {
               type: 'checkbox',
               checked : false
           }
         };
         component.selectedList = results;
       component.templateConfigurations = config;
       component.onChecked(dummyUpEvent, row);
       fixture.detectChanges();
       expect(component.selectedList.length).toBe(1);
     });

     it('should emit on ChangeLevel', function () {
        const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
        const mockEvent = {
            currentTarget: {
              value: undefined
            }
          };
        component.onChangeLevel(mockEvent, row);
        fixture.detectChanges();
        component.levelChanged.subscribe((res: any) => {
            expect(res).toBe(row);
          });
    });

    it('should emit on ChangeLevel', function () {
        const row = { 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' };
        const mockEvent = {
            currentTarget: {
              value: undefined
            }
          };
        component.onChangeLevel(mockEvent, row);
        fixture.detectChanges();
        component.levelChanged.subscribe((res: any) => {
            expect(res).toBe(row);
          });
    });
    
});
