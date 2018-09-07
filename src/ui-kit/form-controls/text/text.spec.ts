import { TestBed } from '@angular/core/testing';
import { SamTextComponent } from './text.component';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import { FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SamFormService } from '../../form-service';

describe('The Sam Text component', () => {
  describe('rendered tests', () => {
    let component: SamTextComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        declarations: [
          SamTextComponent,
          LabelWrapper,
        ],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamTextComponent);
      component = fixture.componentInstance;
      component.label = 'A label can have spaces';
      component.name = 'my-text-component';
    });

    it('should implement controlvalueaccessor', () => {
      component.onChange();
      component.onTouched();
      component.setDisabledState(false);
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.writeValue('hello');
      expect(component.value).toBe('hello');
    });
  
    it('should allow an initial value to be set by the value input', () => {
      component.writeValue('ABC123');
      const input = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
      fixture.whenStable().then(()=>{
        expect(input.nativeElement.value).toBe('ABC123');
      });
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
  });
});
