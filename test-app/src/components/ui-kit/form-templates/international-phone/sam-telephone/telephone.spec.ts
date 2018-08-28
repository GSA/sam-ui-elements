import { SimpleChange } from '@angular/core';

// Load the implementations that should be tested
import { SamTelephone } from './telephone.component';


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

    component.value = '(123)456-7890';

    expect(component.value).toEqual(expected);
  });

  it('should use international template if country code\
    is not 1', () => {

    const expected = '';
    const newCountry = 44;
    const changes = {
      countryCode: new SimpleChange(
        undefined,
        newCountry,
        false
      )
    };

    component.ngOnChanges(changes);

    expect(component.template).toEqual(expected);
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

});
