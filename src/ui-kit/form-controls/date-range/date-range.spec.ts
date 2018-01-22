import { TestBed, async } from '@angular/core/testing';
import { FormsModule, FormControl } from '@angular/forms';
// Load the implementations that should be tested
import { SamDateRangeComponent } from './date-range.component';
import { SamDateComponent } from '../date/date.component';
import { SamTimeComponent } from '../time/time.component';
import { SamDateTimeComponent } from '../date-time/date-time.component';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers';
import { SamUIKitModule } from '../../index';

describe('The Sam Date Range component', () => {
  describe('isolated tests', () => {
    let component: SamDateRangeComponent;

    beforeEach(() => {
      component = new SamDateRangeComponent(new SamFormService());
    });

    it('should get a moment-based date', () => {
      const m = component.getDate({
        month: 11,
        day: 11,
        year: 2017
      });
      expect(m.format(component.OUTPUT_FORMAT)).toBe('2017-11-11');
    });

    it('should update start and end date changes', () => {
      component.writeValue({startDate: '2016-12-29', endDate: '2017-04-01'});
      component.startDateChange('2015-01-01');
      expect(component.startModel.year).toBe(2015);
      expect(component.startModel.month).toBe(1);
      expect(component.startModel.day).toBe(1);
      component.endDateChange('2018-01-01');
      expect(component.endModel.year).toBe(2018);
      expect(component.endModel.month).toBe(1);
      expect(component.endModel.day).toBe(1);
    });
    /**
     * TODO: Needs refactoring since we upgraded version of moment
     */
    xit('should have a date range validation', () => {
      const c = new FormControl({
        startDate: '2012-01-01',
        endDate: '2014-01-01',
      });
      expect(SamDateRangeComponent.dateRangeValidation(c)).toBe(undefined);

      c.patchValue({
        startDate: '2016-01-01',
        endDate: '2014-01-01',
      });
      let returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe('Invalid date range');

      c.patchValue({
        startDate: 'Invalid Date',
        endDate: '2014-01-01',
      });
      returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe('Invalid From Date');

      c.patchValue({
        startDate: '2016-01-01',
        endDate: 'Invalid Date',
      });
      returnVal = SamDateRangeComponent.dateRangeValidation(c);
      expect(returnVal.dateRangeError.message).toBe('Invalid To Date');
    });
  });
  describe('rendered tests', () => {
    let component: SamDateRangeComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, SamWrapperModule],
        declarations: [
          SamDateRangeComponent,
          SamDateComponent,
          SamTimeComponent,
          SamDateTimeComponent
        ],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamDateRangeComponent);
      component = fixture.componentInstance;
      component.writeValue({startDate: '2016-12-29', endDate: '2017-04-01'});
      component.ngOnChanges();
      fixture.detectChanges();
    });
  
    it('should initialize Date', function () {
      expect(true).toBe(true);
    });
  
    it('should match specified date', function () {
      expect(component.startModel.month).toBe(12);
      expect(component.startModel.day).toBe(29);
      expect(component.startModel.year).toBe(2016);
      expect(component.endModel.month).toBe(4);
      expect(component.endModel.day).toBe(1);
      expect(component.endModel.year).toBe(2017);
    });
  
    it('should match specified date-time', function () {
      component.type = 'date-time';
      component.writeValue({
        startDate: '2016-12-29',
        startTime: '11:11',
        endDate: '2017-04-01',
        endTime: '14:09'
      });
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.startModel.month).toBe(12);
      expect(component.startModel.day).toBe(29);
      expect(component.startModel.year).toBe(2016);
      expect(component.endModel.month).toBe(4);
      expect(component.endModel.day).toBe(1);
      expect(component.endModel.year).toBe(2017);
    });
  
    it('should implement controlvalueaccessor + work with custom validations', 
      () => {
      const c = new FormControl('', () => { return undefined; });
      component.required = true;
      component.control = c;
      component.ngOnInit();
      component.onChange();
      component.onTouched();
      component.registerOnTouched(() => undefined);
      component.registerOnChange((_) => undefined);
      component.setDisabledState(false);
      component.writeValue(undefined);
      component.focusHandler();
      expect(true).toBe(true);
    });
  });
});
