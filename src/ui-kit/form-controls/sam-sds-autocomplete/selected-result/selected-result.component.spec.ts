import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SAMSDSSelectedResultComponent } from './selected-result.component';
import { SAMSDSSelectedItemModel } from './models/sds-selectedItem.model';
import { SAMSDSSelectedItemModelHelper, SelectionMode } from './models/sds-selected-item-model-helper';
import { By } from '@angular/platform-browser';
import { SDSSelectedResultConfiguration } from './models/SDSSelectedResultConfiguration';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


describe('SDSSelectedResultComponent', () => {
  let component: SAMSDSSelectedResultComponent;
  let fixture: ComponentFixture<SAMSDSSelectedResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SAMSDSSelectedResultComponent],
      imports: [
        CommonModule, FormsModule, RouterModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SAMSDSSelectedResultComponent);
    component = fixture.componentInstance;
    component.model = new SAMSDSSelectedItemModel();
    component.configuration = new SDSSelectedResultConfiguration();
    component.configuration.primaryKeyField = 'id';
    component.configuration.selectionMode = SelectionMode.SINGLE;
    component.configuration.primaryTextField = 'name';
    component.configuration.secondaryTextField = 'subtext';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty', () => {
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.resultsList'));
    expect(list.nativeElement.children.length).toBe(0);
  });

  it('should have an item', () => {
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }, 'id', SelectionMode.SINGLE, component.model.items);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.resultsList'));
    expect(list.nativeElement.children.length).toBe(1);
  });


  it('should have a single item based on mode', () => {
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }, 'id', SelectionMode.SINGLE, component.model.items);
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '2', 'parentId': null, 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 2' }, 'id', SelectionMode.SINGLE, component.model.items);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.resultsList'));
    expect(list.nativeElement.children.length).toBe(1);
  });


  it('should have an 2 items', () => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }, 'id', SelectionMode.MULTIPLE, component.model.items);
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '2', 'parentId': null, 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 2' }, 'id', SelectionMode.MULTIPLE, component.model.items);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.resultsList'));
    expect(list.nativeElement.children.length).toBe(2);
  });


  it('Tests remove item', () => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    let item2 = { 'id': '2', 'parentId': null, 'name': 'Level 2', 'subtext': 'id 2', 'type': 'Level 2' };
    SAMSDSSelectedItemModelHelper.addItem({ 'id': '1', 'parentId': null, 'name': 'Level 1', 'subtext': 'id 1', 'type': 'Level 1' }, 'id', SelectionMode.MULTIPLE, component.model.items);
    SAMSDSSelectedItemModelHelper.addItem(item2, 'id', SelectionMode.MULTIPLE, component.model.items);
    fixture.detectChanges();
    component.removeItem(item2);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.resultsList'));
    expect(list.nativeElement.children.length).toBe(1);
  });

  it('should handle writeValue', () => {
    component.model = null;
    component.writeValue({});
    expect(component.model).toBe(null);
    let model = new SAMSDSSelectedItemModel();
    component.writeValue(model);
    expect(component.model).toBe(model);
  });

  it('should handle disable', () => {
    expect(component.disabled).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

  it('should handle registerOnChange', () => {
    let item = {};
    component.registerOnChange(item);
    expect(component.propogateChange).toBe(item);
  });

  it('should handle registerOnTouched', () => {
    let item = {};
    component.registerOnTouched(item);
    expect(component.onTouchedCallback).toBe(item);
  });

  it('should handle multi value and depth of values', () => {
    let data = { 'level1': '1', 'sub': { 'level2': '2' } };
    expect(component.getObjectValue(data, 'level1')).toBe('1');
    expect(component.getObjectValue(data, 'sub.level2')).toBe('2');
    expect(component.getObjectValue(data, 'level1,sub.level2')).toBe('1 2');
    expect(component.getObjectValue(data, 'sub.level2,level1')).toBe('2 1');
    let data2 = { 'level1': '1' };
    expect(component.getObjectValue(data2, 'level1,sub.level2')).toBe('1');
  });


});
