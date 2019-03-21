import { SamExtension } from './extension.component';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { SamFormService } from '../../../form-service';
import { SamWrapperModule } from '../../../wrappers';
import { SamFormControlsModule } from '../../../form-controls';

const mockEvent = {
  currentTarget: {
    value: undefined
  }
};

describe('Sam extension', () => {

  let component: SamExtension;

  describe('Standalone tests', () => {

    beforeEach(() => {
      component = new SamExtension(null, null);
      component.name = 'extension';
      component.label = 'Extension';
    });

    it('should validate country code less than 999', () => {
      const value = 5;
      const control = new FormControl();
      control.setValue(value);

      const errs = component.validate(control);

      expect(errs).toBe(null);
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
          SamExtension,
        ],
        providers: [
          SamFormService,
          ChangeDetectorRef
        ]
      });

      fixture = TestBed.createComponent(SamExtension);
      component = fixture.componentInstance;
      component.name = 'extension';
      component.label = 'Extension';
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
          const val = fixture.debugElement.querySelector('.sam-extension').value;
          expect(val).toBe(5);
        }
      )
    });
  })
});