import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamSelectComponent } from './select.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Select component', () => {
  let component: SamSelectComponent;
  let fixture: any;

  let options = [
    {value: 1, label: 'one', name: 'one'},
    {value: 2, label: 'two', name: 'two'},
    {value: 3, label: 'three', name: 'three'}
  ];

  let defaultConfig = {
    options: options,
    label: 'select',
    name: 'my-select',
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamSelectComponent],
    });

    fixture = TestBed.createComponent(SamSelectComponent);
    component = fixture.componentInstance;
    component.options = defaultConfig.options;
    component.label = defaultConfig.label;
    component.name = defaultConfig.name;
  });

  it('should display 3 options if 3 options are specified by the config', function () {
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length);
  });

  it('should allow an initial value to be set by the model input', async(() => {
    component.model = 2;
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.selectedIndex).toBe(1);
    });
  }));

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

  it('should disable the dropdown', async(() => {
    component.disabled = true;
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.disabled).toBe(true);
    });
  }));
});
