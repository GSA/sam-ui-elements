import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHierarchicalTreeHeaderComponent } from './hierarchical-tree-header.component';
import { SamButtonModule } from '../../../elements';
import { SamSelectModule } from '../../../form-controls';
import { SamFormService } from '../../../form-service';
import { SamHierarchicalTreeHeaderConfiguration } from '../models/SamHierarchicalTreeHeaderConfiguration';

const options = [{ "name": "Level 2", "id": "2", "value": "2", "label": "Level 2" },
{ "name": "Level 1", "id": "1", "value": "1", "label": "Level 1" },
{ "name": "TOP", "id": null, "value": null, "label": "TOP" }];

describe('SamHierarchicalTreeHeaderComponent', () => {
  let component: SamHierarchicalTreeHeaderComponent;
  let fixture: ComponentFixture<SamHierarchicalTreeHeaderComponent>;

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
    component.options = options;

    let config = new SamHierarchicalTreeHeaderConfiguration();
    config.minimumCharacterCountSearch = 0;
    component.configuration = config;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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


  it('Delete no char min', () => {
    const event = {
      "key": "Delete",
      "target": { "value": 'id' }
    }
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);

  });

  it('Backspace no char min', () => {
    const event = {
      "key": "Backspace",
      "target": { "value": 'id' }
    }
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);
  });


  it('Delete empty with char min', () => {
    const event = {
      "key": "Delete",
      "target": { "value": '' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);

  });

  it('Backspace empty with char min', () => {
    const event = {
      "key": "Backspace",
      "target": { "value": '' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);
  });


  it('Delete not within emit ', () => {
    const event = {
      "key": "Delete",
      "target": { "value": 'le' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith('');

  });

  it('Backspace not within emit', () => {
    const event = {
      "key": "Backspace",
      "target": { "value": 'ie' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith('');
  });


  it('Delete above min char limit', () => {
    const event = {
      "key": "Delete",
      "target": { "value": 'leb' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);

  });

  it('Backspace above min char limit', () => {
    const event = {
      "key": "Backspace",
      "target": { "value": 'trr' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);
  });


  it('Text above', () => {
    const event = {
      "key": "r",
      "target": { "value": 'trr' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).toHaveBeenCalledWith(event.target.value);
  });


  it('Text below min char count', () => {
    const event = {
      "key": "r",
      "target": { "value": 'tr' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    spyOn(component.filterTextChange, 'emit');
    component.onKeyup(event);
    fixture.detectChanges();
    expect(component.filterTextChange.emit).not.toHaveBeenCalled();
  });

});
