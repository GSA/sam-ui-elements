import { TestBed } from '@angular/core/testing';
import { SamFormControl } from './';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SamFormService } from '../../form-service';
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam Text component', () => {

  let component: SamFormControl;
  const cdr: ChangeDetectorRef = undefined;

  beforeEach(() => {
  
    component = new SamFormControl(
      new SamFormService(),
      cdr
    );

    // Mock Inputs
    component.label = 'First Name';
    component.name = 'first-name';
    component.hint = 'Enter your first name';
    component.errorMessage = 'An error occurred';
    component.required = false;
    component.useFormService = false;
    component.disableValidation = false;
  });

  describe('ControlValueAccessor Tests', () => {
  
    it('should register onchange callback', () => {
      const expected = 20;

      component.registerOnChange(x => x + 10);
      const actual = component.onChange(10);

      expect(actual).toEqual(expected);
    });

    it('should register onTouched callback', () => {
      const expected = 100;

      let actual;
      component.registerOnTouched(() => actual = expected);
      component.onTouched();

      expect(actual).toEqual(expected);
    });

    it('should update internal value on write', () => {
      const expected = 100;

      component.writeValue(expected);
      const actual = component.value;

      expect(actual).toEqual(expected);
    });

    it('should update disabled state', () => {
      const expected = false;

      component.setDisabledState(expected);
      const actual = component.disabled;

      expect(actual).toEqual(expected);
    });

  });

});
