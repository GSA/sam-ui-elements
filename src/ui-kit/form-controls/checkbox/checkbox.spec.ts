import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamCheckboxComponent } from './checkbox.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 
import { FormControl } from "@angular/forms";

describe('The Sam Checkboxes component', () => {
  describe("isolated tests", ()=>{
    let component: SamCheckboxComponent;

    beforeEach(() => {
      component = new SamCheckboxComponent(new SamFormService());
    });

    it("should process checkbox changes", ()=>{
      component.onCheckChanged("test",true);
      expect(component.model[0]).toBe("test");
      
      component.onCheckChanged("test2",true);
      expect(component.model[1]).toBe("test2");

      component.onCheckChanged("test",false);
      expect(component.model[0]).toBe("test2");
    });

    it("should implement controlvalueaccessor", ()=>{
      component.onChange();
      component.onTouched();
      component.registerOnChange((_)=>{});
      component.registerOnTouched(()=>{});
      component.setDisabledState(false);
      component.writeValue(['test']);
      expect(component.model[0]).toBe("test");

      component.writeValue(null);
      expect(component.model.length).toBe(0);
    });

    it("should pass 508", ()=>{
      try{
        component.ngOnInit();
        fail();
      } catch(e){
        expect(true).toBe(true);
      };
    });
  });
  describe("rendered tests", ()=>{
    let component: SamCheckboxComponent;
    let fixture: any;
  
    let options = [
      {value: 'dc', label: 'Washington DC', name: 'dc'},
      {value: 'ma', label: 'Maryland', name: 'maryland'},
      {value: 'va', label: 'Virginia', name: 'virginia'},
    ];
  
    let defaultConfig = {
      options: options,
      label: 'I am a checkbox',
      name: 'i-am-a-checkbox',
    };
  
    let model = ['ma'];
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamCheckboxComponent],
        imports: [SamWrapperModule],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamCheckboxComponent);
      component = fixture.componentInstance;
      component.label = defaultConfig.label;
      component.name = defaultConfig.name;
      component.options = defaultConfig.options;
    });
  
    it('should display 3 checkboxes if 3 options are specified by the config', function () {
      fixture.detectChanges();
      expect(fixture.nativeElement.getElementsByTagName('input').length).toBe(options.length);
    });
  
    it('should display 4 options if select all is specified', function () {
      component.hasSelectAll = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.getElementsByTagName('input').length).toBe(options.length + 1);
    });
  
    it('should select all elements if select all is checked', async(() => {
      component.hasSelectAll = true;
      fixture.detectChanges();
      let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
      selectAllElement.click();
      fixture.detectChanges();
      setTimeout(() => {
        expect(component.model).toEqual(['dc', 'ma', 'va']);
      });
    }));
  
    it('should deselect all elements if select all is checked twice', async(() => {
      component.hasSelectAll = true;
      fixture.detectChanges();
      let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
      selectAllElement.click();
      fixture.detectChanges();
      selectAllElement.click();
      fixture.detectChanges();
      setTimeout(() => {
        expect(component.model).toEqual([]);
      });
    }));
  
    it('should allow an initial value to be set by the model input', async(() => {
      component.model = ['ma'];
      fixture.detectChanges();
      setTimeout(() => {
        let inputs = fixture.debugElement.queryAll(By.css(':checked'));
        expect(inputs.length).toEqual(1);
      });
    }));
  
    it('should show a hint message', function () {
      let hint = "Life pro tip: eat vegetables";
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });
  
    it('should show an error message', function () {
      let errorMessage = "Uh-oh, something went wrong";
      component.errorMessage = errorMessage;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });
  
    it('should show a label', function () {
      let labelText = "Pick from the following options";
      component.label = labelText;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(labelText);
    });

    it("should work with a formcontrol", ()=>{
      let c = new FormControl("",(_)=>{ return null; });
      component.control = c;
      component.options = [
        {
          label: "test",
          name: "test",
          value: "test"
        }
      ];
      component.name = "test-name";
      component.ngOnInit();
    });
  });
});
