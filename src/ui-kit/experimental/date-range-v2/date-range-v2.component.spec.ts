import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { SamWrapperModule } from '../../../ui-kit/wrappers';
import { SamDateRangeV2Component } from './date-range-v2.component';
import { DatepickerComponent } from './datepicker/picker.component';
import { SamInputMaskModule } from '../input-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { SamFormService } from '../../../ui-kit/form-service';
import { CommonModule } from '@angular/common';
import { model } from '@gsa-sam/sam-ui-elements';
const dateModel = {
  startDate: '12/21/01',
  endDate: '12/21/2021'
};



fdescribe('The Sam Date Range component', () => {
  describe('isolated tests', () => {
    let component: SamDateRangeV2Component;

    beforeEach(() => {
      component = new SamDateRangeV2Component();
    });

    it('should get a moment-based date', () => {
      component.ngOnInit();

      expect(component.model.startDate).toBe(undefined);
    });

    xit('should update start and end date changes', () => {
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
    let component: SamDateRangeV2Component;
    let fixture: any;
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, SamWrapperModule, SamInputMaskModule, CommonModule, ReactiveFormsModule],
        declarations: [
          SamDateRangeV2Component,
          DatepickerComponent,
          // SamTimeComponent,
          // SamDateTimeComponent
        ],
        providers: [SamFormService]
      });

      fixture = TestBed.createComponent(SamDateRangeV2Component);
      component = fixture.componentInstance;
      component.dateRangeConfig.label = 'test';
      component.writeValue({startDate: '12/21/01', endDate: '12/21/2021'});
      component.onDateChange();
      fixture.detectChanges();
    });
  
   it('should match specified date', function () {
     // expect(component.model.startDate.month).toBe(12);
      // expect(component.startModel.day).toBe(29);
      // expect(component.startModel.year).toBe(2016);
      // expect(component.endModel.month).toBe(4);
      // expect(component.endModel.day).toBe(1);
      // expect(component.endModel.year).toBe(2017);
    });
  
  //   it('should match specified date-time', function () {
  //     component.type = 'date-time';
  //     component.writeValue({
  //       startDate: '2016-12-29',
  //       startTime: '11:11',
  //       endDate: '2017-04-01',
  //       endTime: '14:09'
  //     });
  //     component.ngOnChanges();
  //     fixture.detectChanges();
  //     expect(component.startModel.month).toBe(12);
  //     expect(component.startModel.day).toBe(29);
  //     expect(component.startModel.year).toBe(2016);
  //     expect(component.endModel.month).toBe(4);
  //     expect(component.endModel.day).toBe(1);
  //     expect(component.endModel.year).toBe(2017);
  //   });
  
  //   it('should implement controlvalueaccessor + work with custom validations', 
  //     () => {
  //     const c = new FormControl('', () => { return undefined; });
  //     component.required = true;
  //     component.control = c;
  //     component.ngOnInit();
  //     component.onChange();
  //     component.onTouched();
  //     component.registerOnTouched(() => undefined);
  //     component.registerOnChange((_) => undefined);
  //     component.setDisabledState(false);
  //     component.writeValue(undefined);
  //     component.focusHandler();
  //     expect(true).toBe(true);
  //   });
  });
});

// fdescribe('SamDateRangeV2Component', () => {
//   let component: SamDateRangeV2Component;
//   let cdr: ChangeDetectorRef;
//   let fixture: ComponentFixture<SamDateRangeV2Component>;

//   beforeEach(() => {


//     TestBed.configureTestingModule({
//       declarations: [
//         SamDateRangeV2Component, DatepickerComponent
//       ],
//       imports: [
//         SamWrapperModule, SamWrapperModule, SamInputMaskModule
//       ],
//     });
//     fixture = TestBed.createComponent(SamDateRangeV2Component);
//     component = fixture.componentInstance;
//   });
//   it('should show a hint message', function () {
//     component.model = dateModel;
//    // fixture.detectChanges();
//     expect(component.model.length).toBe(2);
//   });

// });
