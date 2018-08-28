import { TestBed } from '@angular/core/testing';
import { SamTextareaComponent } from './textarea.component';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SamFormService } from '../../form-service';
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam Textarea component', () => {
  describe('isolated tests', () => {
    let component: SamTextareaComponent;
    const cdr: ChangeDetectorRef = undefined;

    beforeEach(() => {
      component = new SamTextareaComponent(cdr, new SamFormService());
    });

    it('should implement control value accessor', () => {
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.onChange(undefined);
      component.onTouched();
      component.setDisabledState(false);
      component.writeValue('hello');
      expect(component.value).toBe('hello');
    });

    it('should have emitters for keup/focus', () => {
      component.focusEvent.subscribe(data => {
        expect(data).toBe(true);
      });
      component.inputEventChange.subscribe(data => {
        expect(data).toBe('hello');
      });
      component.onFocus(true);
      component.inputEventHandler('hello');

      /*When value sets to some value*/
      component.maxlength = 10;
      component.value = 'hello';
      component.showCharCount = true;
      component.setCharCounterMsg(component.value);
      expect(component.characterCounterMsg).toEqual('5 characters remaining of 10 characters.');

      /*When value is empty*/
      component.maxlength = 10;
      component.value = '';
      component.showCharCount = true;
      component.setCharCounterMsg(component.value);
      expect(component.characterCounterMsg).toEqual('10 characters remaining of 10 characters.');
    });

    it('should check for name', () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  });

  describe('rendered tests', () => {
    let component: SamTextareaComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        declarations: [
          SamTextareaComponent,
          LabelWrapper,
        ],
        providers: [
          SamFormService
        ]
      });

      fixture = TestBed.createComponent(SamTextareaComponent);
      component = fixture.componentInstance;
      component.label = 'A label can have spaces';
      component.name = 'my-text-component';
    });

    it('should allow an initial value to be set by the value input', () => {
      component.writeValue('ABC123');
      fixture.detectChanges();
      expect(component.value).toBe('ABC123');
    });

    it('should show a hint message', () => {
      const hint = 'Life pro tip: eat vegetables';
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });

    it('should show an error message', () => {
      const errorMessage = 'Uh-oh, something went wrong';
      component.errorMessage = errorMessage;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });

    it('should show a label', () => {
      const labelText = 'Pick from the following options';
      component.label = labelText;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(labelText);
    });

    it('should set dynamic css', () => {
      component.width = {type: 'full', full: true};
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('textarea-fullwidth');
    });

    it('should set default css when width is undefined', () => {
      component.width = undefined;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('textarea-normalwidth');
    });
    it('should set default css when width.type is empty', () => {
      component.width = {type: ''};
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('textarea-normalwidth');
    });
    it('should set default css when width.type is normal', () => {
      component.width = {type: 'normal'};
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('textarea-normalwidth');
    });

    it('should work with a form control', () => {
      const c = new FormControl('', () => { return undefined; });
      component.control = c;
      component.requiredFlag = true;
      component.maxlength = 10;
      component.ngOnInit();
      component.ngAfterViewInit();
      component.writeValue('test');
      expect(component.value).toBe('test');
    });
  });
});
