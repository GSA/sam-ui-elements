import { TestBed } from '@angular/core/testing';
import { SamTextComponent } from './text.component';
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule,FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SamFormService } from '../../form-service';
import { ChangeDetectorRef } from "@angular/core";

describe('The Sam Text component', () => {
  describe("isolated tests", ()=>{
    let component: SamTextComponent;
    let cdr: ChangeDetectorRef;
    beforeEach(() => {
      component = new SamTextComponent(new SamFormService(),cdr);
    });

    it("should implement controlvalueaccessor", ()=>{
      component.onChange();
      component.onTouched();
      component.setDisabledState(false);
      component.registerOnChange((_)=>{});
      component.registerOnTouched(()=>{});
      component.writeValue("hello");
      expect(component.value).toBe("hello");
    });
  });
  describe("rendered tests", ()=>{
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
  
    it('should allow an initial value to be set by the value input', () => {
      component.value = "ABC123";
      fixture.detectChanges();
      let input = fixture.debugElement.query(By.css('#my-text-component'));
      expect(input.nativeElement.value).toBe("ABC123");
    });
  
    it('should show a hint message', () => {
      let hint = "Life pro tip: eat vegetables";
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });
  
    it('should show an error message', () => {
      let errorMessage = "Uh-oh, something went wrong";
      component.errorMessage = errorMessage;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });
  
    it('should show a label', () => {
      let labelText = "Pick from the following options";
      component.label = labelText;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(labelText);
    });

    it("should render with a control", ()=>{
      let c = new FormControl("test", ()=>{return null});
      
      component.name = "test-name";
      component.control = c;
      component.required = true;
      component.maxlength = 10;
      component.ngOnInit();
      component.ngAfterViewInit();
      component.onInputChange("test2");
      expect(component.value).toBe("test2");
    });
  });
});
