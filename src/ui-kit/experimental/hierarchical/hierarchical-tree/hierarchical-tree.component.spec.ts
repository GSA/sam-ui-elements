import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamHierarchicalTreeComponent } from './hierarchical-tree.component';
import { SamHierarchicalTreeGridComponent } from '../hierarchical-tree-grid/hierarchical-tree-grid.component';
import { SamHierarchicalTreeHeaderComponent } from '../hierarchical-tree-header/hierarchical-tree-header.component';
import { SamHierarchicalTreeFooterComponent } from '../hierarchical-tree-footer/hierarchical-tree-footer.component';
import { SamButtonModule } from '../../../elements';
import { SamSelectModule } from '../../../form-controls';
import { SamFormService } from '../../../form-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CdkTableModule} from '@angular/cdk';
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { HierarchyConfiguration } from '../../hierarchical/hierarchical-tree/hierarchical-tree.component';
import { ExpectedConditions } from 'protractor';

const options = [{ 'name': 'Level 2', 'id': '1', 'value': '237', 'label': 'Level 2' },
{ 'name': 'Level 1', 'id': null, 'value': '1', 'label': 'Level 1' }];

const config: HierarchyConfiguration = {
  gridDisplayedColumn: [],
  primaryKey: 'id',
  options: options
};

// const data = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' },
// { 'id': '478', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 478', 'type': 'Level 1' },
// { 'id': '1138', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1138', 'type': 'Level 1' },
// { 'id': '2723', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 2723', 'type': 'Level 1' },
// { 'id': '4549', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 4549', 'type': 'Level 1' }];

describe('SamHierarchicalTreeComponent', () => {
  let component: SamHierarchicalTreeComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SamButtonModule,
        SamSelectModule,
        FormsModule,
        CommonModule,
        CdkTableModule,
        SamDataTableModule
      ],
      declarations: [ SamHierarchicalTreeComponent,
         SamHierarchicalTreeGridComponent,
         SamHierarchicalTreeHeaderComponent,
         SamHierarchicalTreeFooterComponent ],
         providers: [SamFormService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeComponent);
    component = fixture.componentInstance;
    component.hierarchyConfiguration = config;
    fixture.detectChanges();
  });
 

  it('Should emit results on select', () => {
    const results = [{ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }];
    component.results = results;
    component.hierarchyConfiguration = config;
    component.selectResults.subscribe((res: any) => { 
      expect(res).toBe(component.results);
    });
    component.onSelect();
  });

});
