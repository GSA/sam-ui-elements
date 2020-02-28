import {
    TestBed,
    async,
    ComponentFixtureAutoDetect,
    ComponentFixture
} from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
// Load the implementations that should be tested
import {FieldsetWrapper} from './fieldset-wrapper.component';

describe('The Sam Fieldset Wrapper component', () => {
  describe('isolated tests', () => {
    let component: FieldsetWrapper;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new FieldsetWrapper(cdr);
    });
    /**
     * TODO: This test passes when run in isolation, then fails in the 
     * rendered tests. Not sure how rendered tests are even running
     * this test to begin with.
     */
    it('should not clear error message when errormessages list greater than 0', () => {
      component.errorMessages = [];
     const group = new FormGroup(
        {
          prefix: new FormControl('1'),
          phone: new FormControl('1234567'),
          extension: new FormControl('')
        }
      );
      group.controls.prefix.setErrors({
        required: true
      });
      group.controls.phone.setErrors({
        required: true
      });

        group.controls.phone.markAsDirty();
        group.controls.prefix.markAsDirty();
        group.controls.extension.markAsDirty();

      component.formatErrors(group.controls.prefix, group.controls.phone, group.controls.extension);
      expect(component.errorMessages.length).toBe(2);
    });
    it('should clear error message when errormessages list is 0', () => {
      component.errorMessages = [];
     const group = new FormGroup(
        {
          prefix: new FormControl('1'),
          phone: new FormControl('1234567'),
          extension: new FormControl('')
        }
      );
      component.formatErrors(group.controls.prefix, group.controls.phone, group.controls.extension);
      expect(component.errorMessages.length).toBe(0);
    });


    it("should not display any error message if the component is not touched but having error",()=>{
        component.errorMessages = [];
        const group = new FormGroup(
            {
                phone: new FormControl('1234567'),
                extension: new FormControl('')
            }
        );
        group.controls.phone.setErrors({
            required: true
        });
        component.formatErrors(group.controls.phone, group.controls.extension);
        expect(component.errorMessages.length).toBe(0);

    });

    it('should display error messages with a form control', () => {
      component.formatErrors(undefined);

      const control = new FormControl('');
      component.formatErrors(control);
      expect(component.errorMessage).toBe(undefined);

      control.markAsDirty();
      control.setErrors({
        maxlength: {
          actualLength: 12,
          requiredLength: 10
        }
      });
      component.formatErrors(control);
      expect(component.errorMessage)
        .toBe('12 characters input but max length is 10');

      control.setErrors({
        required: true
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe('This field is required');

      control.setErrors({
        isNotBeforeToday: true
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe('Date must not be before today');
      
      control.setErrors({
        dummyError: {
          message: 'test message'
        }
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe('test message');

      control.setErrors({
        dummyError: true
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe('Invalid');

      control.reset();
      control.markAsDirty();
      component.formatErrors(control);
      expect(component.errorMessage).toBe(undefined);
    });
    
    it('should clear error messages', () => {
      component.errorMessage = 'abc';
      component.clearError();
      expect(component.errorMessage).toBe(undefined);
    });
  });

  describe('integration tests', () => {
    let component: FieldsetWrapper;
    let fixture: any;
      
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FieldsetWrapper]
      });
      fixture = TestBed.createComponent(FieldsetWrapper);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    xit('should have toggleable hints', () => {
      component.hint = 'Lorem Ipsum is simply dummy text of the printing \
        and typesetting industry. Lorem Ipsum has been the industry\'s \
        standard dummy text ever since the 1500s, when an unknown printer \
        took a galley of type and scrambled it to make a type specimen \
        book. It has survived not only five centuries, but also the leap \
        into electronic typesetting, remaining essentially unchanged.';
      component.ngOnChanges({
        hint: {
          previousValue: false,
          currentValue: true
        }
      });
      fixture.detectChanges();
      expect(component.hintContainer.nativeElement.getAttribute('style'))
        .toContain('overflow: hidden;');
      component.toggleHint(false);
      fixture.detectChanges();
      expect(component.hintContainer.nativeElement.getAttribute('style'))
        .toBe('');
      });
  });
});
