import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import {
  SamIntlPhoneGroup
} from './international.component';

import { SamInternationalPrefix } from './sam-international-prefix';
import { SamTelephone } from './sam-telephone/telephone.component';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule } from '@angular/forms'; 
import { SamFormControlsModule } from '../../form-controls';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamExtension } from './sam-extension';

describe('The Sam International Phone Group', () => {

  describe('rendered tests', () => {
    let component: SamIntlPhoneGroup;
    let fixture: any;
  
    const group = new FormGroup({
      prefix: new FormControl('1'),
      phone: new FormControl('1234')
    });
  
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
          SamIntlPhoneGroup,
          SamInternationalPrefix,
          SamTelephone,
          SamExtension
        ],
        providers: [
          SamFormService,
          ChangeDetectorRef
        ]
      });
  
      fixture = TestBed.createComponent(SamIntlPhoneGroup);
      component = fixture.componentInstance;
      component.phoneName = "test";
      component.prefixName = "test";
      component.extensionName = "test";
      component.group = group;
    });

    it('should rerun validation on phone when prefix\
      changes', () => {
      component.group.controls.prefix.setValue('2');
      component.group.updateValueAndValidity();
      component.group.controls.prefix.setValue('1');
      component.group.updateValueAndValidity();
      fixture.detectChanges();
      const expected = component.group.controls.phone.valid;

      expect(expected).toBe(false);
    });

    it('should throw if no name is provided for controls',
      () => {
        component.phoneName = '';
        component.prefixName = '';
        component.extensionName = '';

        try {
          fixture.detectChanges();
          fail();
        } catch (exception){
          expect(true).toBe(true);
          //fix component so it cleans up properly
          component.phoneName = 'a';
          component.prefixName = 'a';
          component.extensionName = 'a';
          component.ngOnInit();
        }
    });

    it('should throw if no name is provided for prefix',
      () => {
      component.phoneName = 'asdf';
      component.prefixName = '';
      try {
        fixture.detectChanges();
        fail();
      } catch (exception){
        expect(true).toBe(true);
        //fix component so it cleans up properly
        component.phoneName = 'a';
        component.prefixName = 'a';
        component.ngOnInit();
      }
    });

    it('should throw if no name is provided for phone',
      () => {
      component.phoneName = '';
      component.prefixName = 'asdf';

      try {
        fixture.detectChanges();
        fail();
      } catch (exception){
        expect(true).toBe(true);
        //fix component so it cleans up properly
        component.phoneName = 'a';
        component.prefixName = 'a';
        component.ngOnInit();
      }

      // Adding here to keep component from throwing
      // during cleanup
      component.phoneName = 'a';
      component.prefixName = 'a';
    });

    it('should set controls from group', () => {
      fixture.detectChanges();
      expect(component.phoneControl)
        .toEqual(component.group.controls.phone)

      expect(component.prefixControl)
        .toEqual(component.group.controls.prefix)
    });

    it('should correctly update countryCode and rerun\
      validations when prefix changes', 
      () => {
        component.phoneName = 'a';
        component.prefixName = 'a';
        fixture.detectChanges();

        const countryCode = '2';
        component.phoneControl.setValue('asdf')
        component.prefixControl.setValue(countryCode);

        fixture.detectChanges();
        const expected = component.countryCode;

        expect(expected).toEqual(countryCode);
        expect(component.phoneControl.valid).toBe(false);
    });
  });
});
