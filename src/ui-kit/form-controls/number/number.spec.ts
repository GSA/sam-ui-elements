import { TestBed } from '@angular/core/testing';
import { SamNumberComponent } from './number.component';
import {
  LabelWrapper
} from '../../wrappers/label-wrapper/label-wrapper.component';
import { FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SamFormService } from '../../form-service';
import { ChangeDetectorRef } from '@angular/core'; 

describe('The Sam Number component', () => {
  describe('isolated tests', () => {
    let component: SamNumberComponent;
    const cdr: ChangeDetectorRef = undefined;

    beforeEach(() => {
      component = new SamNumberComponent(new SamFormService(), cdr);
    });

    it('should implement controlvalueaccessor', () => {
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.onChange();
      component.onTouched();
      component.setDisabledState(false);
      component.writeValue(12);
      expect(component.value).toBe(12);
    });
  });
  
  describe('rendered tests', () => {
    let component: SamNumberComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        declarations: [
          SamNumberComponent,
          LabelWrapper,
        ],
        providers: [
          SamFormService
        ]
      });
  
      fixture = TestBed.createComponent(SamNumberComponent);
      component = fixture.componentInstance;
      component.label = 'A label can have spaces';
      component.name = 'my-num-component';
    });
  
    it('should allow an initial value to be set by the value input', () => {
      component.onInputChange(123);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('#my-num-component'));
      expect(input.nativeElement.value).toBe('123');
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

    it('should work with a form control', () => {
      const c = new FormControl('', () => { return undefined; });
      component.name = 'test-name';
      component.control = c;
      component.required = true;
      component.ngOnInit();
      component.ngAfterViewInit();
      component.writeValue(11);
      fixture.detectChanges();
      expect(component.value).toBe(11);
    });
  });
});
