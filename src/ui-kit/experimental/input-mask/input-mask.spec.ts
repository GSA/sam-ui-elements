import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { SamInputMaskComponent } from './input-mask.component';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam Input Mask component', () => {
    let component: SamInputMaskComponent;
    let cdr: ChangeDetectorRef;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
        component = new SamInputMaskComponent(<any>{
            detectChanges: ()=>{}
        }, new SamFormService());
        component.template = "__/__/____";
    });

    it('Should compile', () => {
        expect(true).toBe(true);
    });

    it('Should check for template', ()=>{
        component.template = null;
        try{
            component.ngOnInit();
            fail();
        } catch(exception){
            expect(exception.toString()).toContain('No template provided');
        }
    });

    it('test numberToTemplate', () => {
        expect(component.numberToTemplate("12122013")).toBe('12/12/2013');
    });
    
    it('should test templateToNumber', () => {
        expect(component.templateToNumber('12/12/2013')).toBe('12122013');
    });

    it('should test onFocus', () => {
        component.onHostFocus();
        component.writeValue("12/12/2013");
        component.onFocus();
        expect(component.value).toBe('12122013');
    });

    it('should test onBlur', () => {
        component.writeValue("12122013");
        component.onBlur();
        expect(component.value).toBe('12/12/2013');
    });

    it('should test modelChange', () => {
        component.maxlength = 10;
        component.previousVal = '12/12/201';
        component.onModelChange("12/12/2013");
        expect(component.value).toBe("12/12/2013");
        component.onModelChange("");
        expect(component.value).toBe("");
    });

    it('should test that maxlength is always a number', () => {
        try{
            component.maxlength = <any>"10";
            component.ngOnChanges({
                maxlength: "10"
            });
            fail();
        } catch (exception){
            expect(exception.toString()).toContain('Wrong data type passed in for maxlength');
        }
    });

});
