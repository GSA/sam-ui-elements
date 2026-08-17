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
      const errMsg = 'Country codes must be 3 digits or fewer';
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

      // Trigger ngOnInit (which seeds the default value) before simulating input.
      fixture.detectChanges();

      component.inputChange(mock);

      expect(component.value).toBe('5');
      expect(component.inputValue).toBe('5');
    });

    it('should not prevent a digit key from being entered', () => {
      const mock = {
        key: 5,
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: function(){}
      };

      component.onKeyInput(mock);

      expect(mock.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent a non-digit key from being entered', () => {
      const mock = {
        key: 'g',
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: function(){}
      };

      component.onKeyInput(mock);

      expect(mock.preventDefault).toHaveBeenCalled();
    });
  })
});
