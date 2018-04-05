import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import {
  SamIntlPhoneGroup
} from './international.component';

import { SamInternationalPrefix } from './sam-international-prefix';
import { SamTelephone } from './sam-telephone/telephone.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule } from '@angular/forms'; 
import { SamFormControlsModule } from '../../form-controls';
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam International Phone Group', () => {

  describe('rendered tests', () => {
    let component: SamIntlPhoneGroup;
    let fixture: any;
  
    const group = new FormGroup({
      prefix: new FormControl(1),
      phone: new FormControl(1234)
    });
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SamWrapperModule,
          SamFormControlsModule,
          FormsModule,
          ReactiveFormsModule
        ],
        declarations: [
          SamIntlPhoneGroup,
          SamInternationalPrefix,
          SamTelephone
        ],
        providers: [
          SamFormService,
          ChangeDetectorRef
        ]
      });
  
      fixture = TestBed.createComponent(SamIntlPhoneGroup);
      component = fixture.componentInstance;
      component.group = group;
    });

    it('should rerun validation on phone when prefix\
      changes', () => {
      component.group.controls.prefix.setValue(2);
      component.group.updateValueAndValidity();
      component.group.controls.prefix.setValue(1);
      component.group.updateValueAndValidity();
      fixture.detectChanges();
      const expected = component.group.controls.phone.valid;

      expect(expected).toBe(false);
    });
  });
});
