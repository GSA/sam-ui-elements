import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule } from '@angular/forms'; 
import { TestBed } from '@angular/core/testing';

import {
  SamInternationalPrefix
} from './international-prefix.component';
import { SamFormService } from '../../../form-service';
import { SamWrapperModule } from '../../../wrappers'; 
import { SamFormControlsModule } from '../../../form-controls';


describe('Sam International Prefix', () => {

  let component: SamInternationalPrefix;

  describe('Standalone tests', () => {

    beforeEach(() => {
      component = new SamInternationalPrefix(null, null);
      component.name = 'tel';
      component.label = 'Phone';
    });
  
    it('should validate country code less than 999', () => {
      const value = 5;
      const control = new FormControl();
      control.setValue(value);
  
      const errs = component.validate(control);
  
      expect(errs).toBe(null);
    });
  
    it('should invalidate country code > 999', () => {
      const value = 1000;
      const errMsg = 'Country codes must be 3 numbers or fewer';
      const control = new FormControl();
      control.setValue(value);
  
      const errs = component.validate(control);
  
      expect(errs.countryCode.message).toBe(errMsg);
    });
  })



  describe('Rendered tests', () => {
    let fixture;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          FormsModule,
          ReactiveFormsModule,
          SamWrapperModule,
          SamFormControlsModule,
        ],
        declarations: [
          SamInternationalPrefix,
        ],
        providers: [
          SamFormService,
          ChangeDetectorRef
        ]
      });
  
      fixture = TestBed.createComponent(SamInternationalPrefix);
      component = fixture.componentInstance;
      component.name = 'tel';
      component.label = 'Phone';
    });

    it('should set internal value when input changes', () => {
      const mock = {
        currentTarget: {
          value: '5'
        }
      };
  
      component.inputChange(mock);

      fixture.detectChanges();
      
      fixture.whenStable().then(
        () => {
          const val = fixture.debugElement.querySelector('.sam-international-prefix').value;
          expect(val).toBe(5);
        }
      )


    });
  })
});
