import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { SamWrapperModule } from '../../../ui-kit/wrappers';
import { SamDateRangeV2Component } from './date-range-v2.component';
import { DatepickerComponent } from './datepicker/picker.component';
import { SamInputMaskModule } from '../../experimental/input-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { SamFormService } from '../../../ui-kit/form-service';
import { CommonModule } from '@angular/common';

const dateModel = {
  startDate: '12/21/01',
  endDate: '12/21/2021'
};


const dateRangeSettings = {
  label: 'Date Range',
  hint: 'Date range for ad-hoc report',
  cancelText: 'Close',
  errorMessage: 'Invalid',
  required: 'true'
};

const startDateConfig = {
  name: 'Start Date',
  placeholder: 'Start Date',
  label: 'start',
  hint: '',

  rangeStart: new Date(),
  rangeEnd: new Date(),
  showCalendar: true,
  weekStart: 0,
  dateFormat: 'M/DD/YYYY',
  disabled: false
};

const endDateConfig = {
  name: 'End Date',
  placeholder: 'End Date',
  label: 'end',
  hint: '',

  rangeStart: new Date(),
  rangeEnd: new Date(),
  showCalendar: true,
  weekStart: 0,
  dateFormat: 'M/DD/YYYY',
  disabled: false
};

describe('The Sam Date Range V2 component', () => {

  describe('isolated tests', () => {
    let component: SamDateRangeV2Component;

    beforeEach(() => {
      component = new SamDateRangeV2Component();
    });

    it('should get a moment-based date', () => {
      component.ngOnInit();
      expect(component.model.startDate).toBe('');
    });

  });
  describe('rendered tests', () => {
    let component: SamDateRangeV2Component;
    let fixture: any;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, SamWrapperModule, SamInputMaskModule, CommonModule, ReactiveFormsModule],
        declarations: [
          SamDateRangeV2Component,
          DatepickerComponent,
        ],
        providers: [SamFormService]
      });
      component = new SamDateRangeV2Component();
      fixture = TestBed.createComponent(SamDateRangeV2Component);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.startDateConfig = startDateConfig;
      component.endDateConfig = endDateConfig;
      component.model = dateModel;
      component.dateRangeConfig = dateRangeSettings;
      component.writeValue({ startDate: '12/21/01', endDate: '12/21/2021' });
      component.onDateChange();
    });

    it('should match specified date', function () {
      expect(component.model.startDate).toBe('12/21/01');
       expect(component.model.endDate).toBe('12/21/2021');
    });

  });
});


