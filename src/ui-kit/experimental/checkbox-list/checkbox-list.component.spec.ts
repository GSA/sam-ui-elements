import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SamCheckboxListComponent } from './checkbox-list.component';
import { SamAccordionComponent ,SamAccordionSection} from '../../components/accordion/accordion.component';
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

fdescribe('CheckboxListComponent', () => {
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
    // fixture.detectChanges();
    // component.ngOnInit();
  });


  it('onChecked checked/unchecked', () => {
    component.options = options;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.selectedList.length).toBe(2);
    // expect(component.selectResults.emit).toHaveBeenCalledWith(component.selectedList);
  });
  it('Up arrow when on first item', fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.checkbox-container'));
    expect(container.nativeElement.children.length).toBe(4);
    expect(component.options[0]['highlighted']).toBeTruthy();
    const upEvent = {
      "key": "Up",
      "target": { "value": 'id' }
    }
    component.onKeyup(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[0]['highlighted']).toBeTruthy();
  }));
});
