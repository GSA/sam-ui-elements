import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser/index';
import {FormsModule} from '@angular/forms';
// Load the implementations that should be tested
import { SamPhoneEntryComponent } from './phone-entry.component';
import { SamFormControlsModule } from '../../form-controls';
import { SamWrapperModule } from '../../wrappers';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';

describe('The Sam Phone Entry component', () => {
  let component: SamPhoneEntryComponent;
  let fixture: any;

  let model = "";

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamFormControlsModule,SamWrapperModule,FormsModule],
      declarations: [SamPhoneEntryComponent],
      providers: [SamFormService]
    });

    fixture = TestBed.createComponent(SamPhoneEntryComponent);
    component = fixture.componentInstance;
    component.model = "1+(234)213-4213";
    component.ngOnInit();
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
