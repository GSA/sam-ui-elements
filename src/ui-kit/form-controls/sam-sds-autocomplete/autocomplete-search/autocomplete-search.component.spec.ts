/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SAMSDSAutocompleteSearchComponent } from './autocomplete-search.component';
import { SAMSDSAutocompleteSearchConfiguration } from './models/SAMSDSAutocompleteConfiguration';
import { FormsModule } from '@angular/forms';
import { SAMSDSSelectedItemModel } from '../selected-result/models/sds-selectedItem.model';
import { SelectionMode } from '../selected-result/models/sds-selected-item-model-helper';
import { By } from '@angular/platform-browser';
import { AutoCompleteSampleDataService } from './autocomplete-seach-test-service.spec';

describe('SamAutocompleteComponent', () => {
  let component: SAMSDSAutocompleteSearchComponent;
  let fixture: ComponentFixture<SAMSDSAutocompleteSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SAMSDSAutocompleteSearchComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SAMSDSAutocompleteSearchComponent);
    component = fixture.componentInstance;
    component.service = new AutoCompleteSampleDataService();
    component.model = new SAMSDSSelectedItemModel();
    component.configuration = new SAMSDSAutocompleteSearchConfiguration();
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

  it('Should have an input', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeDefined();
  });

  it('Should have an input id', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes.id).toBe('autoId');
  });

  it('Should have empty results not exist', () => {
    fixture.detectChanges();
    expect(component.resultsListElement).toBe(undefined);
  });

  it('Should have empty results with invalid search', fakeAsync(() => {

    const event = {
      preventDefault: ()=>{},
      target: component.input.nativeElement
    };
    component.input.nativeElement.value = "test search";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(1);
    const emptyItem = fixture.debugElement.query(By.css('.emptyResults'));
    expect(emptyItem).toBeTruthy();
  }));

  it('Should have results with minimumCharacterCountSearch', fakeAsync(() => {

    const event = {
      preventDefault: ()=>{},
      target: component.input.nativeElement
    };
    component.input.nativeElement.value = "Level 7";
    component.input.nativeElement.focus();
    component.configuration.minimumCharacterCountSearch = 3;
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(3);

  }));





  it('Should have results key press', fakeAsync(() => {
    const event = {
      preventDefault: ()=>{},
      target: component.input.nativeElement
    };
    component.input.nativeElement.value = "id";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));



  it('Should have empty results key press minimumCharacterCountSearch', fakeAsync(() => {
    const event = {
      "key": "d",
      "target": { "value": 'id' }
    }
    component.configuration.minimumCharacterCountSearch = 3;
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list).toBe(null);
  }));



  it('Should have results on focus', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));

  it('Should not have results on focus', fakeAsync(() => {
    component.configuration.focusInSearch = false;
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.sds-autocomplete'));
    expect(list).toBeNull();
  }));

  it('Select second item with down and up arrows', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      "key": "Down",
      "target": { "value": 'id' }
    }
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges()
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[1]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' }
    }
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));

  it('Up arrow when on first item', fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' }
    }
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));


  it('Down arrow when on over lists item', fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
    component.listItemHover(component.results.length - 1);
    fixture.detectChanges();
    tick();
    expect(component.results[component.results.length - 1]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Down",
      "target": { "value": 'id' }
    }
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();

    expect(component.results[10]['highlighted']).toBeTruthy();
  }));


  it('Should have delete have results', fakeAsync(() => {
    const event = {
      preventDefault: ()=>{},
      target: component.input.nativeElement
    };
    component.input.nativeElement.value = "id";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));


  it('Should have results Escape press', fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const listBefore = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(listBefore.nativeElement.children.length).toBe(11);
    const event = {
      "key": "Escape",
      "target": { "value": 'id' }
    }
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(listAfter).toBeFalsy();

  }));

  it('Should have reuslts on focus', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
  }));

  it('select item with enter key', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]['highlighted']).toBeTruthy();
    const event = {
      "key": "Enter",
      "target": { "value": 'id' }
    }
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.model.items.length).toBe(1);
  }));


  it('hover over item is highlighted', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    component.listItemHover(10);
    fixture.detectChanges();
    tick();
    expect(component.results[10]['highlighted']).toBeTruthy();
  }));


  it('clearInput and results closed', fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(list.nativeElement.children.length).toBe(11);
    component.clearInput();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(By.css('.autocomplete-result'));
    expect(listAfter).toBeFalsy();
  }));


  it('should handle writeValue', () => {
    component.model = null;
    component.writeValue({});
    expect(component.model).toBe(null);
    let model = new SAMSDSSelectedItemModel();
    component.writeValue(model);
    expect(component.model).toBe(model);
    expect(component.inputValue).toBe("");
    model = new SAMSDSSelectedItemModel();
    model.items = [{
      id: 'aaa',
      value: 'bbb'
    }];
    component.configuration.selectionMode = SelectionMode.SINGLE;
    component.configuration.primaryTextField = "value"
    component.writeValue(model);
    expect(component.model).toBe(model);
    expect(component.inputValue).toBe("bbb");
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

  it('should free text be shown', () => {
    let textValue = 'Some value';
    expect(component.showFreeText()).toBeFalsy();
    component.configuration.isFreeTextEnabled = true;
    expect(component.showFreeText()).toBeFalsy();
    component.inputValue = textValue;
    expect(component.showFreeText()).toBeTruthy();
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

