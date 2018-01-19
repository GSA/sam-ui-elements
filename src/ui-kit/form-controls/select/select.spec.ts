import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamSelectComponent } from './select.component';
import { SamWrapperModule } from '../../wrappers';
import {SamFormService } from '../../form-service';
import { FormsModule, FormControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam Select component', () => {
  describe('isolated tests', () => {
    let component: SamSelectComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamSelectComponent(cdr, new SamFormService());
    });

    it('should implement controlvalueaccessor', () => {
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.setDisabledState(false);
      component.writeValue(['aaa']);
      expect(component.model[0]).toBe('aaa');
    });

    it('should check for a name', () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  });
  describe('rendered tests', () => {
    let component: SamSelectComponent;
    let fixture: any;
  
    const options = [
      {value: 1, label: 'one', name: 'one'},
      {value: 2, label: 'two', name: 'two'},
      {value: 3, label: 'three', name: 'three'}
    ];
  
    const defaultConfig = {
      options: options,
      label: 'select',
      name: 'my-select',
    };
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamSelectComponent],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamSelectComponent);
      component = fixture.componentInstance;
      component.options = defaultConfig.options;
      component.label = defaultConfig.label;
      component.name = defaultConfig.name;
    });
  
    it('should display 3 options if 3 options are specified by the config',
      function () {
      fixture.detectChanges();

      expect(fixture.nativeElement.getElementsByTagName('option').length)
        .toBe(options.length);
    });
  
    it('should allow an initial value to be set by the model input',
      async(() => {
      component.model = 2;
      fixture.detectChanges();

      setTimeout(() => {
        const selectElement =
          fixture.nativeElement.getElementsByTagName('select')[0];
        expect(selectElement.selectedIndex).toBe(1);
      });
    }));
  
    it('should show a hint message', function () {
      const hint = 'Life pro tip: eat vegetables';
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });
  
    it('should show an error message', function () {
      const errorMessage = 'Uh-oh, something went wrong';
      component.errorMessage = errorMessage;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });
  
    it('should show a label', function () {
      const labelText = 'Pick from the following options';
      component.label = labelText;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(labelText);
    });
  
    it('should disable the dropdown', async(() => {
      component.disabled = true;
      fixture.detectChanges();
      setTimeout(() => {
        const selectElement =
          fixture.nativeElement.getElementsByTagName('select')[0];
        expect(selectElement.disabled).toBe(true);
      });
    }));

    it('should work with form controls', () => {
      const c = new FormControl([], () => { return undefined; });
      component.control = c;
      component.ngOnInit();
      component.ngAfterViewInit();
      
    });
  });
});
