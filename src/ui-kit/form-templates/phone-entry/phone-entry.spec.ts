import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser/index';
// Load the implementations that should be tested
import { SamPhoneEntryComponent } from './phone-entry.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Phone Entry component', () => {
  let component: SamPhoneEntryComponent;
  let fixture: any;

  let model = "";

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamPhoneEntryComponent],
    });

    fixture = TestBed.createComponent(SamPhoneEntryComponent);
    component = fixture.componentInstance;
    component.phoneNumber = "1+(234)213-4213";
  });

  it('Phone Num Check', function () {
    let component = fixture.componentInstance,
        el = component.phoneInput;

    fixture.detectChanges();
    el.nativeElement.dispatchEvent(new Event('keydown'));//keydown update the model component model value
    fixture.detectChanges();
    expect(component.model).toBe("1+(234)213-4213");
  });

});
