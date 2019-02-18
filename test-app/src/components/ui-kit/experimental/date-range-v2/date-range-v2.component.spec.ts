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
      expect(component.model.startDate.month).toBe(12);
      // expect(component.startModel.day).toBe(29);
      // expect(component.startModel.year).toBe(2016);
      // expect(component.endModel.month).toBe(4);
      // expect(component.endModel.day).toBe(1);
      // expect(component.endModel.year).toBe(2017);
    });
  });
});
