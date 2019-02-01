import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamCheckboxListComponent } from './checkbox-list.component';
import { SamAccordionComponent, SamAccordionSection } from '../../components/accordion/accordion.component';
import { By } from '@angular/platform-browser';

const options = [
  { name: 'id1', value: 'test1', label: 'test-id1', required: false, checked: false },
  { name: 'id2', value: 'test2', label: 'test-id2', required: true, checked: true },
  { name: 'id3', value: 'test3', label: 'test-id3', required: false, checked: false },
  { name: 'id4', value: 'test4', label: 'test-id4', required: false, checked: false },
  { name: 'id5', value: 'test5', label: 'test-id5', required: false, checked: true },
  { name: 'id6', value: 'test6', label: 'test-id6', required: false, checked: false },
  { name: 'id7', value: 'test7', label: 'test-id7', required: false, checked: false },
  { name: 'id8', value: 'test8', label: 'test-id8', required: false, checked: false },
];

describe('SamCheckboxListComponent', () => {
  let component: SamCheckboxListComponent;
  let fixture: ComponentFixture<SamCheckboxListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        SamCheckboxListComponent,
        SamAccordionSection,
        SamAccordionComponent,
      ],
    });

    fixture = TestBed.createComponent(SamCheckboxListComponent);
    component = fixture.componentInstance;
    component.options = options;
  });

  it('on init', () => {
    component.options = options;
    component.ngOnInit();
    fixture.detectChanges();
    component.selectResults.subscribe((res: any) => {
      expect(res.length).toBe(2);
    });
  });

  it('Should have reuslts on focus', fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(container.nativeElement.children.length).toBe(8);

  }));

  it('onChecked checked/unchecked', () => {
    let ev = {
      target: {
        checked: true
      }
    };
    component.options = options;
    const row = options[6];
    spyOn(component.selectResults, 'emit');
    component.onChecked(ev, row);
    fixture.detectChanges();
    expect(component.selected.length).toBe(1);
    expect(component.selectResults.emit).toHaveBeenCalledWith(component.selected);
    ev.target.checked = false;
    component.onChecked(ev, row);
    fixture.detectChanges();
    expect(component.selected.length).toBe(0);
    expect(component.selectResults.emit).toHaveBeenCalledWith(component.selected);
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
      "target": { "value": 'id' }
    }
    component.onKeyDown(downEvent);
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(component.options[1]['highlighted']).toBeTruthy();

    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' }
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
      "target": { "value": 'id' }
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
      "target": { "value": 'id' }
    }
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();

    expect(component.options[7]['highlighted']).toBeTruthy();
  }));
});
