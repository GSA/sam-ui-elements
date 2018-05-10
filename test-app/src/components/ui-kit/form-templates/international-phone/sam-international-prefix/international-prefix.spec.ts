import {
  SamInternationalPrefix
} from './international-prefix.component';
import { FormControl } from '@angular/forms';

describe('Sam International Prefix', () => {

  let component: SamInternationalPrefix;

  beforeEach(() => {
    component = new SamInternationalPrefix(null, null);
    component.name = 'tel';
    component.label = 'Phone';
  });

  it('should set internal value when input changes', () => {
    const mock = {
      currentTarget: {
        value: 5
      }
    };

    component.inputChange(mock);

    expect(component.value).toBe(5);
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
    const errMsg = 'Country codes cannot exceed 3 digits';
    const control = new FormControl();
    control.setValue(value);

    const errs = component.validate(control);

    expect(errs.countryCode.message).toBe(errMsg);
  });

});
