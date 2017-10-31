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
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(component.hour_v.nativeElement.value).toBe("2");
      expect(component.minute_v.nativeElement.value).toBe("44");
      expect(component.amPm).toBe('pm');
    });
  });
  it('should parse hours and minutes 2', () => {
    component.value = "00:01";
    component.parseValueString();
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(component.hour_v.nativeElement.value).toBe("12");
      expect(component.minute_v.nativeElement.value).toBe("1");
      expect(component.amPm).toBe('am');
    });
  });

  it('should convert hours and minutes to iso standard times', () => {
    component.hours = "12";
    component.minutes = "24";
    component.amPm = 'am';
    fixture.detectChanges();
    component.selectChange();
    component.valueChange.subscribe(val=>{
      expect(val).toEqual('00:24');
    });
  });

  it('should convert hours and minutes to iso standard times(2)', () => {
    component.hours = "02";
    component.minutes = "24";
    component.amPm = 'pm';
    fixture.detectChanges();
    component.selectChange();
    component.valueChange.subscribe(val=>{
      expect(val).toEqual("14:24");
    });
  });
});
