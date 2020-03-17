/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SAMSDSAutocompleteComponent } from './autocomplete.component';
import { AutoCompleteSampleDataService } from '../autocomplete-search/autocomplete-seach-test-service.spec';
import { SAMSDSAutocompletelConfiguration } from './models/SDSAutocompletelConfiguration.model';
import { SAMSDSSelectedItemModel } from '../selected-result/models/sds-selectedItem.model';
import { FormsModule } from '@angular/forms';
import { SelectionMode } from '../selected-result/models/sds-selected-item-model-helper';
import { SAMSdsSelectedResultsModule } from '../selected-result/selected-result.module';
import { SAMSDSAutocompleteSearchModule } from '../autocomplete-search/autocomplete-search.module';


describe('SAMSDSAutocompleteComponent', () => {
  let component: SAMSDSAutocompleteComponent;
  let fixture: ComponentFixture<SAMSDSAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SAMSDSAutocompleteComponent],
      imports: [FormsModule, SAMSdsSelectedResultsModule, SAMSDSAutocompleteSearchModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SAMSDSAutocompleteComponent);
    component = fixture.componentInstance;
    component.service = new AutoCompleteSampleDataService();
    component.model = new SAMSDSSelectedItemModel();
    component.configuration = new SAMSDSAutocompletelConfiguration();
    component.configuration.id = 'autoId';
    component.configuration.primaryKeyField = 'id';
    component.configuration.selectionMode = SelectionMode.SINGLE;
    component.configuration.primaryTextField = 'name';
    component.configuration.secondaryTextField = 'subtext';
    component.configuration.debounceTime = 0;
    component.configuration.autocompletePlaceHolderText = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle modes', () => {
    expect(component.isSingleMode()).toBeTruthy();
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    expect(component.isSingleMode()).toBeFalsy();
    component.configuration = null;
    expect(component.isSingleMode()).toBeFalsy();
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

});

