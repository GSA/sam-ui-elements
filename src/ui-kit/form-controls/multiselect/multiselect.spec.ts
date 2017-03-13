import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamMultiSelectComponent } from './multiselect.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Select component', () => {
  let component: SamMultiSelectComponent;
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
      providers: [SamMultiSelectComponent],
    });

    fixture = TestBed.createComponent(SamMultiSelectComponent);
    component = fixture.componentInstance;
    component.options = defaultConfig.options;
    component.label = defaultConfig.label;
    component.name = defaultConfig.name;
  });

  it('should display 3 options if 3 options are specified by the config', function () {
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length);
  });
});
