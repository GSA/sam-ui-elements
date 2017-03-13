import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamRadioButtonComponent } from './radiobutton.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Radio Buttons component', () => {
  let component: SamRadioButtonComponent;
  let fixture: any;

  let options : [any] = [
    {value: 'dc', label: 'Washington DC', name: 'dc'},
    {value: 'ma', label: 'Maryland', name: 'dc'},
    {value: 'va', label: 'Virginia', name: 'virginia'},
  ];

  let defaultOptions = {
    options: options,
    label: 'Radio buttons',
    name: 'my-radio-buttons'
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamRadioButtonComponent],
      imports: [SamUIKitModule]
    });

    fixture = TestBed.createComponent(SamRadioButtonComponent);
    component = fixture.componentInstance;
    component.options = defaultOptions.options;
    component.label = defaultOptions.label;
    component.name = defaultOptions.name;
  });

  it('should display 3 radiobuttons if 3 options are specified by the config', function () {
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('input').length).toBe(options.length);
  });

  it('should allow an initial value to be set by the model input', async(() => {
    component.model = 'ma';
    fixture.detectChanges();
    let checkedElement = fixture.debugElement.query(By.css(':checked + label'));
    expect(checkedElement.nativeElement.innerHTML).toContain('Maryland');
    expect(checkedElement.nativeElement.innerHTML).not.toContain('DC');
  }));

  it('should deselect one radio button when another is clicked', function () {
    component.model = 'ma';
    fixture.detectChanges();
    let label1 = fixture.debugElement.query(By.css(':checked + label')).nativeElement.innerHTML;
    component.model = 'dc';
    fixture.detectChanges();
    let label2 = fixture.debugElement.query(By.css(':checked + label')).nativeElement.innerHTML;
    expect(label1).not.toEqual(label2);
  });

  it('should show a hint message', function () {
    let hint = "Life pro tip: eat vegetables";
    component.hint = hint;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });

  it('should show an error message', function () {
    let errorMessage = "Uh-oh, something went wrong";
    component.errorMessage = errorMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', function () {
    let labelText = "Pick from the following options";
    component.label = labelText;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

});
