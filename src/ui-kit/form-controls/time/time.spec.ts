import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamTimeComponent } from './time.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 

describe('The Sam Time component', () => {
  describe('isolated test', () => {
    let component: SamTimeComponent;
    beforeEach(() => {
      component = new SamTimeComponent(new SamFormService());
    });

    it('should check for name', () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it('should check for clean values', () => {
      expect(component.isEmptyField()).toBe(true);
      component.hours = 10;
      component.minutes = 10;
      expect(component.isEmptyField()).toBe(false);
    });

    it('should check numbers', () => {
      expect(component._keyIsNumber('c')).toBe(undefined);
      expect(component._keyIsNumber('2')).toBe(true);
    });

    it('should check for copy/paste chars', () => {
      expect(component._checkCopyPasteChar('c')).toBe(true);
      expect(component._checkCopyPasteChar('v')).toBe(true);
      expect(component._checkCopyPasteChar('z')).toBe(undefined);
    });

    it('should implement controlvalueaccessor', () => {
      component.setDisabledState(false);
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.writeValue('12:12');
      expect(true).toBe(true);
    });
  });

  describe('rendered test', () => {
    let component: SamTimeComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
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
  
    xit('should parse hours and minutes', () => {
      component.writeValue('14:44');
      component.parseValueString();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.hourV.nativeElement.value).toBe('2');
        expect(component.minuteV.nativeElement.value).toBe('44');
        expect(component.amPm).toBe('pm');
      });
    });
    it('should parse hours and minutes 2', () => {
      component.writeValue('00:01');
      component.parseValueString();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.hourV.nativeElement.value).toBe('12');
        expect(component.minuteV.nativeElement.value).toBe('1');
        expect(component.amPm).toBe('am');
      });
    });

    xit('should render resets', () => {
      component.writeValue('12:12');
      fixture.detectChanges();
      component.writeValue('');
      fixture.detectChanges();
      expect(component.hourV.nativeElement.value).toBe('');
      expect(component.minuteV.nativeElement.value).toBe('');
    });

    xit('should process keypress', () => {
      const hourEl = fixture.debugElement.queryAll(By.css('input'))[0];
      const minuteEl = fixture.debugElement.queryAll(By.css('input'))[1];
      hourEl.triggerEventHandler('keydown', {
        keyCode: 49,
        key: '1',
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });
      hourEl.triggerEventHandler('keydown', {
        keyCode: 49,
        key: '1',
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });
      minuteEl.triggerEventHandler('keydown', {
        keyCode: 49,
        key: '1',
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });
      minuteEl.triggerEventHandler('keydown', {
        keyCode: 49,
        key: '1',
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });
      const time = component.getTime().format(component.OUTPUT_FORMAT);
      expect(time).toBe('11:11');
    });
  });
});
