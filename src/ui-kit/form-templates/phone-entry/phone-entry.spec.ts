import { TestBed, async } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import {FormsModule,FormControl} from '@angular/forms';
// Load the implementations that should be tested
import { SamPhoneEntryComponent } from './phone-entry.component';
import { SamFormControlsModule } from '../../form-controls';
import { SamWrapperModule } from '../../wrappers';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';

describe('The Sam Phone Entry component', () => {
  describe('isolated tests',()=>{
    let component: SamPhoneEntryComponent;
    let cdr: ChangeDetectorRef;
    beforeEach(() => {
      component = new SamPhoneEntryComponent(new SamFormService(), cdr);
    });

    it('should have a prefixer for ids',()=>{
      component.prefix = "test";
      expect(component.getIdentifier("dummy")).toBe('test-dummy');
    });

    it('should implement controlvalueaccessor',()=>{
      component.onChange();
      component.onTouched();
      component.registerOnChange((_)=>{});
      component.registerOnTouched(()=>{});
      component.setDisabledState(false);
      //writevalue used in rendered tests
    });

    it('should have emitters',()=>{
      component.emitter.subscribe(data=>{
        expect(data).toBe("");
      });
      component.emit();
    });
  });
  describe('rendered tests',()=>{
    let component: SamPhoneEntryComponent;
    let fixture: any;
    let el;
    let model = "";
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamFormControlsModule,SamWrapperModule,FormsModule],
        declarations: [SamPhoneEntryComponent],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamPhoneEntryComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('input'));
    });
  
    it('should process key presses (number)', function () {
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0,0);
      for(let i=0; i<11; i++){
        el.triggerEventHandler('keydown',{
          keyCode:49,
          key: '1',
          preventDefault: ()=>{}
        });
      }
      
      expect(component.model).toBe("1+(111)111-1111");
    });

    it('should process key presses (backspace+misc)', function(){
      component.writeValue("1+(111)111-1111");
      fixture.detectChanges();
      el.triggerEventHandler('keydown',{
        keyCode:8,
        preventDefault: ()=>{}
      });
      expect(component.model).toBe("1+(111)111-111_");

      //backspace w/selection
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0,4);
      el.triggerEventHandler('keydown',{
        keyCode:8,
        preventDefault: ()=>{}
      });
      expect(component.model).toBe("_+(_11)111-111_");

      //right
      el.triggerEventHandler('keydown',{
        keyCode:39,
        preventDefault: ()=>{}
      });
      //left
      el.triggerEventHandler('keydown',{
        keyCode:37,
        preventDefault: ()=>{}
      });
      el.triggerEventHandler('keydown',{
        keyCode:70,
        key: 'f',
        preventDefault: ()=>{}
      });
    });

    it('should work with numbersOnly', function(){
      component.numbersOnly = true;
      component.ngOnInit();
      component.writeValue("11231231234");
      fixture.detectChanges();
      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0,0);
      for(let i=0; i<11; i++){
        el.triggerEventHandler('keydown',{
          keyCode:49,
          key: '1',
          preventDefault: ()=>{}
        });
      }
      expect(component.model).toBe("11111111111");
    });

    it('should work with formcontrols', function(){
      component.model = "";
      component.control = new FormControl('');
      component.ngOnInit();
      component.ngAfterViewInit();

      el.nativeElement.focus();
      el.nativeElement.setSelectionRange(0,0);
      for(let i=0; i<11; i++){
        el.triggerEventHandler('keydown',{
          keyCode:49,
          key: '1',
          preventDefault: ()=>{}
        });
      }
      expect(component.model).toBe("1+(111)111-1111");
    });
  });
});
