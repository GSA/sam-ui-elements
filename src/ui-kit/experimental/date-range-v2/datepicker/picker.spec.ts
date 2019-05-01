import { TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './picker.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { SamFormService } from '../../../form-service';

describe('The picker component', () => {
  describe('isolated tests', () => {
    let component: DatepickerComponent;
    let cdr: ChangeDetectorRef;
    beforeEach(() => {
        component = new DatepickerComponent(new SamFormService(), cdr);
    });

    it('test ngOnInit', () => {
        component.ngOnInit();
        expect(component.dayNamesOrdered[0]).toBe('S');
        expect(component.dayNamesOrdered[1]).toBe('M');
        expect(component.dayNamesOrdered[2]).toBe('T');
        expect(component.dayNamesOrdered[3]).toBe('W');
        expect(component.dayNamesOrdered[4]).toBe('T');
        expect(component.dayNamesOrdered[5]).toBe('F');
        expect(component.dayNamesOrdered[6]).toBe('S');
    });
  });
});
