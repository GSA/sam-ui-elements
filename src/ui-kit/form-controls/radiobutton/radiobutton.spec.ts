import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamRadioButtonComponent } from './radiobutton.component';
import { SamWrapperModule } from '../../wrappers';
import { SamFormService } from '../../form-service';
import { FormsModule, FormControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

describe('The Sam Radio Buttons component', () => {
  describe('isolated tests', () => {
    let component: SamRadioButtonComponent;
    let cdr: ChangeDetectorRef;
    beforeEach(() => {
      component = new SamRadioButtonComponent(cdr);
    });



    it('should process radio changes', () => {
      component.onRadioChange('newval');
      expect(component.model).toBe('newval');
    });

    it('should pass 508', () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  });
  describe('rendered tests', () => {
    let component: SamRadioButtonComponent;
    let fixture: any;

    const options: any[] = [
      { value: 'dc', label: 'Washington DC', name: 'dc' },
      { value: 'ma', label: 'Maryland', name: 'dc' },
      { value: 'va', label: 'Virginia', name: 'virginia' },
    ];

    const defaultOptions = {
      options: options,
      label: 'Radio buttons',
      name: 'my-radio-buttons'
    };

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamRadioButtonComponent],
        imports: [SamWrapperModule, FormsModule],
        providers: [SamFormService]
      });

      fixture = TestBed.createComponent(SamRadioButtonComponent);
      component = fixture.componentInstance;
      component.options = defaultOptions.options;
      component.label = defaultOptions.label;
      component.name = defaultOptions.name;
    });

    it('should display 3 radiobuttons if 3 options are specified by the config',
      function () {
        fixture.detectChanges();

        expect(fixture.nativeElement.getElementsByTagName('input').length)
          .toBe(options.length);
      });

    it('should allow an initial value to be set by the model input',
      async(() => {
        component.model = 'ma';
        fixture.detectChanges();

        const checkedElement =
          fixture.debugElement.query(By.css(':checked + label'));

        expect(checkedElement.nativeElement.innerHTML).toContain('Maryland');
        expect(checkedElement.nativeElement.innerHTML).not.toContain('DC');
      }));

    it('should deselect one radio button when another is clicked', function () {
      component.model = 'ma';
      fixture.detectChanges();

      const label1 = fixture.debugElement
        .query(By.css(':checked + label'))
        .nativeElement.innerHTML;

      component.model = 'dc';
      fixture.detectChanges();

      const label2 = fixture.debugElement
        .query(By.css(':checked + label'))
        .nativeElement.innerHTML;

      expect(label1).not.toEqual(label2);
    });

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

    it('should work with a form control', () => {
      const c = new FormControl('', () => { return undefined; });
      component.control = c;
      component.name = 'test-name';
      component.ngOnInit();
    });
  });
});
