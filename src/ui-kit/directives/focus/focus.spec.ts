import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { Component,Output,ViewChild,EventEmitter } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamFocusDirective} from './focus.directive';

@Component({
  selector: 'test-cmp',
  template: `
<div #var sam-focus
(focus)="focusHandler()">
<p class="test">
test content
</p>
</div>
<p class="test2">
not focused content
</p>`
})
class TestComponent {
    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('var') var;
    focusHandler(){
        this.action.emit(true);
    }
}
describe('The Sam Focus directive', () => {
    let directive:SamFocusDirective;
    let component:TestComponent;
    let fixture:any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamFocusDirective,TestComponent],
      });
  
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.query(By.directive(SamFocusDirective)).injector.get(SamFocusDirective);
    });
  
    it('should compile', () => {
        expect(true).toBe(true);
    });

    it("should fire focus event", ()=>{
        component.action.subscribe(val=>{
            expect(val).toBe(true);
        });
        let el = fixture.debugElement.query(By.css(".test"));
        el.nativeElement.click();

        let el2 = fixture.debugElement.query(By.css(".test2"));
        el2.nativeElement.click();
    });

    it("should check for focus on keyup", ()=>{
        component.action.subscribe(val=>{
            expect(val).toBe(true);
        });
        let el = fixture.debugElement.query(By.css(".test"));
        let evt = document.createEvent("Event");
        evt.initEvent("keyup",true,true);
        el.nativeElement.dispatchEvent(evt);

        let el2 = fixture.debugElement.query(By.css(".test2"));
        el2.nativeElement.dispatchEvent(evt);
    });
});