import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { SamTimeComponent } from './time.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 

describe('The Sam Time component', () => {
  let component: SamTimeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamWrapperModule,FormsModule],
      declarations: [SamTimeComponent],
      providers: [SamFormService]
    });

    fixture = TestBed.createComponent(SamTimeComponent);
    component = fixture.componentInstance;
    component.name = 'test';
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should parse hours and minutes', () => {
    component.value = "14:44";
    component.parseValueString();
    expect(component.hours).toBe("02");
    expect(component.minutes).toBe("44");
    expect(component.amPm).toBe('pm');

    component.value = "00:01";
    fixture.detectChanges();
    component.parseValueString();
    expect(component.hours).toBe("12");
    expect(component.minutes).toBe("01");
    expect(component.amPm).toBe('am');
  });

  it('should convert hours and minutes to iso standard times', () => {
    component.hours = "12";
    component.minutes = "24";
    component.amPm = 'am';
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      component.selectChange();
      let time = component.value;
      expect(time).toEqual('00:24');
    });
  });

  it('should convert hours and minutes to iso standard times(2)', () => {
    component.hours = "02";
    component.minutes = "24";
    component.amPm = 'pm';
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      component.selectChange();
      let time = component.value;
      expect(time).toEqual("14:24");
    });
  });
});
