import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamListBoxComponent } from './listbox.component';
import { By } from '@angular/platform-browser';
import { SamWrapperModule } from '../../../ui-kit/wrappers';

const options = [
  { name: 'id1', value: 'test1', label: 'test-id1', required: false, checked: false, disabled: false },
  { name: 'id2', value: 'test2', label: 'test-id2', required: true, checked: true, disabled: false },
  { name: 'id3', value: 'test3', label: 'test-id3', required: false, checked: false, disabled: false },
  { name: 'id4', value: 'test4', label: 'test-id4', required: false, checked: false, disabled: false },
  { name: 'id5', value: 'test5', label: 'test-id5', required: false, checked: true, disabled: false },
  { name: 'id6', value: 'test6', label: 'test-id6', required: false, checked: false, disabled: false },
  { name: 'id7', value: 'test7', label: 'test-id7', required: false, checked: false, disabled: false },
  { name: 'id8', value: 'test8', label: 'test-id8', required: false, checked: false, disabled: false },
];

describe('SamListBoxComponent', () => {
  let component: SamListBoxComponent;
  let fixture: ComponentFixture<SamListBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SamWrapperModule
      ],
      declarations: [
        SamListBoxComponent,
      ],
    });
    fixture = TestBed.createComponent(SamListBoxComponent);
    component = fixture.componentInstance;
    component.options = options;
  });

  it('on init with singlemode', () => {
    component.options = options;
    component.isSingleMode = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.model.length).toBe(0);
  });

  it('onCheck with single mode', () => {
    let ev = {
      target: {
        checked: true
      }
    };
    component.isSingleMode = true;
    component.options = options;
    const row = options[6];
    component.onChecked(ev, row);
    fixture.detectChanges();
    expect(component.model.length).toBe(1);
  });

  it('Should have reuslts on focus', fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(container.nativeElement.children.length).toBe(8);
  }));

  it('should show a hint message', function () {
    const hint = 'Life pro tip: eat vegetables';
    component.hint = hint;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });
  it('should show an error message', function () {
    const errorMessage = 'Uh-oh, something went wrong';
    component.errorMessage = errorMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', function () {
    const labelText = 'Pick from the following options';
    component.label = labelText;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

  it('should disable', function () {
    component.options[0].disabled = true;
    fixture.detectChanges();
    const value = component.checkboxListElement.nativeElement.getElementsByTagName("input")[0];
    expect(value.disabled).toBe(true);
    component.options[0].disabled = false;
    fixture.detectChanges();
    expect(value.disabled).toBe(false);
  });

  it('should implement controlvalueaccessor', () => {
    component.onChange();
    component.onTouched();
    component.registerOnChange((_) => undefined);
    component.registerOnTouched(() => undefined);
    component.writeValue(['test']);
    expect(component.model[0]).toBe('test');

    component.writeValue(undefined);
    expect(component.model.length).toBe(0);
  });

  it('Checking option mode', () => {
    component.isSingleMode = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.optionsMode).toBe('radio');
    component.isSingleMode = false;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.optionsMode).toBe('checkbox');
  });

  it('onChecked checked/unchecked', () => {
    let ev = {
      target: {
        checked: true
      }
    };
    component.options = options;
    const row = options[6];

    component.onChecked(ev, row);
    fixture.detectChanges();
    ev.target.checked = false;
    component.onChecked(ev, row);
    fixture.detectChanges();
  });

  it('should process arrow up and down keypresses', fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(container.nativeElement.children.length).toBe(8);
    const downEvent = {
      "key": "Down",
      "target": { "value": 'id' },
      preventDefault: function () { },
    }
    component.onKeyDown(downEvent);
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(component.options[1]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' },
      preventDefault: function () { },
    }
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[0]['highlighted']).toBeTruthy();
  }));

  it('Up arrow when on first item', fakeAsync(() => {
    component.options = options;
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(list.nativeElement.children.length).toBe(8);
    expect(component.options[0]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' },
      preventDefault: function () { },
    }
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[0]['highlighted']).toBeTruthy();
  }));

  it('Down arrow when on over lists item', fakeAsync(() => {
    component.options = options;
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(component.options[0]['highlighted']).toBeTruthy();
    component.onHover(component.options.length - 1);
    fixture.detectChanges();
    tick();
    expect(component.options[component.options.length - 1]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Down",
      "target": { "value": 'id' },
      preventDefault: function () { },
    }
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[7]['highlighted']).toBeTruthy();
  }));

  it('Should remove item from selected reuslts', fakeAsync(() => {
    let ev = {
      target: {
        checked: false
      }
    };
    component.model.push(options[1]);
    spyOn(component.modelChange, 'emit');
    component.onChecked(ev, options[1]);
    fixture.detectChanges();
    expect(component.model.length).toBe(0);
    expect(component.modelChange.emit).toHaveBeenCalledWith(component.model);
  }));

});
