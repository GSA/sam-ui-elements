import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamHierarchicalTreeGridComponent, HierarchicalDataSource } from './hierarchical-tree-grid.component';
import { SamDataTableModule, SamSortDirective } from '../../../components';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

export interface GridTemplateConfiguration {
  displayedColumns: any[];
  primaryKey: string;
}

describe('SamHierarchicalTreeGridComponent', () => {
  let component: SamHierarchicalTreeGridComponent;
  component = new SamHierarchicalTreeGridComponent();
  let fixture: ComponentFixture<SamHierarchicalTreeGridComponent>;
  let template: GridTemplateConfiguration;
  template = {
    displayedColumns: ['id', 'name'],
    primaryKey: 'id'
  };
  let dataSource :  HierarchicalDataSource | null;
  let dataChange = new BehaviorSubject<any[]>([]);
   let gridData = [
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
    let hierarchicalDataSource: HierarchicalDataSource | null;
    let sort: SamSortDirective;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SamDataTableModule
      ],
      declarations: [SamHierarchicalTreeGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeGridComponent);

    component = fixture.componentInstance;
   
    template.displayedColumns = ['1', '2'];
    // component.templateConfigurations.primaryKey ='id';
    component.templateConfigurations = template;
    fixture.detectChanges();
  });


  it('update display column', () => {
    component.displayedColumns = ['select'];
    component.ngOnInit();
    expect(component.displayedColumns.length).toBe(3);
  });

  it('dataSource',()=>{
  

  })
});
