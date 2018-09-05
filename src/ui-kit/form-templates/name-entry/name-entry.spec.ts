import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamNameEntryComponent } from './name-entry.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 
import { FormsModule, FormControl } from '@angular/forms'; 
import { SamFormControlsModule } from '../../form-controls';

const modelMock = {
  firstName: 'John',
  middleName: '',
  lastName: 'Doe',
  suffix: 'Sr.'
};

describe('The Sam Name Entry component', () => {
  describe('isolated tests', () => {
    let component: SamNameEntryComponent;

    beforeEach(() => {
      component = new SamNameEntryComponent();
      component.prefix = 'test';
      component.model = {...modelMock};
    });

    it('should use formControlAccessor', () => {
      component.setDisabledState(false);
      component.onChange();
      component.onTouched();
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.modelChange(); // triggers ontouched,onchanged
      const mockValue = {
        firstName: 'aaa',
        middleName: 'bbb',
        lastName: 'ccc',
        suffix: 'ddd'
      };
      component.writeValue(mockValue);
      expect(component.value).toBe(mockValue);

      expect(component.model.firstName).toBe('aaa');
      expect(component.model.middleName).toBe('bbb');
      expect(component.model.lastName).toBe('ccc');
      expect(component.model.suffix).toBe('ddd');

      component.writeValue(undefined);
      expect(component.model.firstName).toBe('');
      expect(component.model.middleName).toBe('');
      expect(component.model.lastName).toBe('');
      expect(component.model.suffix).toBe('');
    });

    it('should validate based on a control', () => {
      // todo: revisit this, its all wrong...
      const c = new FormControl('');
      expect(component.validate(c)).toBe(undefined);

      component.model.firstName = '123';
      component.model.lastName = '123';
      component.model.middleName = '123';
      expect(component.validate(c)).toBeTruthy();
    });

    it('should validate first name', () => {
      expect(component.validateFirstName()).toBe(true);

      component.model.firstName = '123';
      expect(component.validateFirstName()).toBe(false);

      component.model.firstName = '';
      expect(component.validateFirstName()).toBe(false);
    });

    it('should validate middle name', () => {
      expect(component.validateMiddleName()).toBe(true);

      component.model.middleName = '123';
      expect(component.validateMiddleName()).toBe(false);
    });

    it('should validate last name', () => {
      expect(component.validateLastName()).toBe(true);

      component.model.lastName = '123';
      expect(component.validateLastName()).toBe(false);

      component.model.lastName = '';
      expect(component.validateLastName()).toBe(false);
    });

    it('should have a prefixer for id attributes', () => {
      const str = component.getIdentifer('dummy');
      expect(str).toBe('test-dummy');
    });
  });
  describe('rendered tests', () => {
    let component: SamNameEntryComponent;
    let fixture: any;
  
    const model = modelMock;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, SamFormControlsModule, FormsModule],
        declarations: [SamNameEntryComponent],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamNameEntryComponent);
      component = fixture.componentInstance;
      component.model = model;
    });
  
    it('First name Check', function () {
      fixture.detectChanges();
      expect(
        fixture.nativeElement
        .querySelector('#first-name')
        .getAttribute('ng-reflect-model')
      )
      .toBe('John');
    });
    it('Last name Check', function () {
      fixture.detectChanges();
      expect(
        fixture.nativeElement
        .querySelector('#last-name')
        .getAttribute('ng-reflect-model')
      )
      .toBe('Doe');
    });
  });
});
