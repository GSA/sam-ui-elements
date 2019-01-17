import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header.component';
import { SamButtonModule } from '../../../elements';
import { SamSelectModule } from '../../../form-controls';
import { SamFormService } from '../../../form-service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


const options = [{ "name": "Level 2", "id": "2", "value": "2", "label": "Level 2" },
{ "name": "Level 1", "id": "1", "value": "1", "label": "Level 1" },
{ "name": "TOP", "id": null, "value": null, "label": "TOP" }];

describe('SamHierarchicalTreeHeaderComponent', () => {
  let component: SamHierarchicalTreeHeaderComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeHeaderComponent>;
  let de: DebugElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SamButtonModule,
        SamSelectModule,
        FormsModule,
        CommonModule
      ],
      declarations: [SamHierarchicalTreeHeaderComponent],
      providers: [SamFormService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalTreeHeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.options = options;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit when select changes', () => {
    const button = de.query(By.css('button'));
    let emittedAction: any;
    component.filterTextChange.subscribe((_: any) => { emittedAction = _; });
    fixture.detectChanges();
    button.triggerEventHandler('click', undefined);
    expect(emittedAction).toBe(component.selectModel);
  });

  it('navigateToParent with child', () => {
    spyOn(component.selectBreadcrumb, 'emit');
    component.navigateToParent();
    fixture.detectChanges();
    expect(component.selectBreadcrumb.emit).toHaveBeenCalledWith('1');
  });


  it('navigateToParent with top level navigation', () => {
    spyOn(component.selectBreadcrumb, 'emit');
    options.shift();
    component.navigateToParent();
    fixture.detectChanges();
    expect(component.selectBreadcrumb.emit).toHaveBeenCalledWith(null);
  });


  it('onLevelChange', () => {
    component.selectModel = '1';
    spyOn(component.selectBreadcrumb, 'emit');
    component.onLevelChange(null);
    fixture.detectChanges();
    expect(component.selectBreadcrumb.emit).toHaveBeenCalledWith('1');
  });

});
