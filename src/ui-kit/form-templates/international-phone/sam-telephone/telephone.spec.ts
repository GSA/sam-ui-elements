import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl } from '@angular/forms';
// Load the implementations that should be tested
import { SamTelephone } from './telephone.component';
import { SamFormControlsModule } from '../../../form-controls';
import { SamWrapperModule } from '../../../wrappers';
import { SamUIKitModule } from '../../../index';
import { SamFormService } from '../../../form-service';

const mockEvent = {
  currentTarget: {
    value: undefined
  }
};


describe('Sam Telephone Component', () => {

  let component: SamTelephone;

  beforeEach(() => {
    component = new SamTelephone(null, null);
    component.name = 'tel';
    component.label = 'Phone';
    component.placeholder = 'ex: (555)555-5555';
  });


  it('should set value to a number when input value\
    changes', () => {
      const expected = '1234567890';

      mockEvent.currentTarget.value = '(123)456-7890';
      component.inputChange(mockEvent);
      
      expect(component.value).toEqual(expected);
  });

  it('should convert value from template to number when\
    value is set', () => {
    const expected = '1234567890';

    component.value = '(123) 456 - 7890';

    expect(component.value).toEqual(expected);
  });

  it('should use international template if country code\
    is not 1', () => {

    const expected = '';

    component.countryCode = 44;

    expect(component.template).toEqual('');
  });

  it('should use international validation if country code\
    is not 1', () => {
    const expected = '1234567890123456'; // Len > 15 fails

    component.countryCode = 44;
    
    expect('').not.toBeNull();
  });

  it('should format input value to numbers only when\
    element is focused', () => {
    const expected = '1234567890';

    mockEvent.currentTarget.value = '(123)456-7890';
    component.handleFocus(mockEvent);

    expect(component.inputValue).toEqual(expected);
  });

  it('should format input value to template string when\
    element is blurred', () => {
      const expected = '(123)456-7890';

      mockEvent.currentTarget.value = '1234567890';
      component.handleBlur(mockEvent);
  
      expect(component.inputValue).toEqual(expected);
  });

  it('should validate North American Numbers', () => {
    const testValue1 = 1234;
    const testValue2 = 1234567890;
    const testValue3 = 12345678901;

    const control = new FormControl();

    // Test 1
    control.setValidators(component.validate);
    component.writeValue(testValue1);
    control.setValue(component.value);
    expect(control.valid).toBeFalsy();

    // Test 2
    control.setValidators(component.validate);
    component.writeValue(testValue2);
    control.setValue(component.value);
    expect(control.valid).toBeTruthy();

    // Test 3
    control.setValidators(component.validate);
    component.writeValue(testValue3);
    control.setValue(component.value);
    expect(control.valid).toBeFalsy();
  });

  it('should validate international numbers', () => {
    const testValue1 = 123456789012345;
    const testValue2 = 1234567890123456;

    const control = new FormControl();

    // Test 1
    control.setValidators(component.validate);
    component.writeValue(testValue1);
    control.setValue(component.value);
    expect(control.valid).toBeTruthy();

    // Test 2
    control.setValidators(component.validate);
    component.writeValue(testValue2);
    control.setValue(component.value);
    expect(control.valid).toBeFalsy();
  });

});
