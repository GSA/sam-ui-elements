import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamTimeComponent } from './time.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Time component', () => {
  let component: SamTimeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamTimeComponent],
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
    expect(component.hours).toBe(2);
    expect(component.minutes).toBe(44);
    expect(component.amPm).toBe('pm');

    component.value = "00:01";
    fixture.detectChanges();
    component.parseValueString();
    expect(component.hours).toBe(12);
    expect(component.minutes).toBe(1);
    expect(component.amPm).toBe('am');
  });

  it('should convert hours and minutes to iso standard times', () => {
    component.hours = 12;
    component.minutes = 24;
    component.amPm = 'am';
    let time = component.toString();
    expect(time).toEqual('00:24:00');

    component.hours = 2;
    component.minutes = 24;
    component.amPm = 'pm';
    time = component.toString();
    expect(time).toEqual("14:24:00");
  });
});
