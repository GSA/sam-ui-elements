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
import { CdkTableModule } from '@angular/cdk';
import { SamDataTableModule, SamSortDirective } from '../../../components/data-table';
import { SamHierarchicalTreeConfiguration } from '../models/SamHierarchicalTreeConfiguration';
import { ExpectedConditions } from 'protractor';

const options = [{ 'name': 'Level 2', 'id': '1', 'value': '237', 'label': 'Level 2' },
{ 'name': 'Level 1', 'id': null, 'value': '1', 'label': 'Level 1' }];

const config: SamHierarchicalTreeConfiguration = {
  gridDisplayedColumn: [],
  primaryKey: 'id'
};


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
      declarations: [SamHierarchicalTreeComponent,
        SamHierarchicalTreeGridComponent,
        SamHierarchicalTreeHeaderComponent,
        SamHierarchicalTreeFooterComponent],
      providers: [SamFormService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeComponent);
    component = fixture.componentInstance;
    component.configuration = config;
    fixture.detectChanges();
  });



});
