import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { Component,Output,ViewChild,EventEmitter } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamTabOutsideDirective} from './taboutside.directive';

@Component({
  selector: 'test-cmp',
  template: `
<div #var sam-tab-outside
(tabOutside)="tabOutsideHandler()">
<p class="test">
test content
</p>
</div>
<p class="test2">
click outside target content
</p>`
})
class TestComponent {
    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('var') var;
    tabOutsideHandler(){
        this.action.emit(true);
    }
}
describe('The Sam Tab Outside directive', () => {
    let directive:SamTabOutsideDirective;
    let component:TestComponent;
    let fixture:any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamTabOutsideDirective,TestComponent],
      });
  
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.query(By.directive(SamTabOutsideDirective)).injector.get(SamTabOutsideDirective);
    });
  
    it('should compile', () => {
        expect(true).toBe(true);
    });

    it("should check for tab outside", ()=>{
        component.action.subscribe(val=>{
            expect(val).toBe(true);
        });
        let el = fixture.debugElement.query(By.css(".test"));
        let el2 = fixture.debugElement.query(By.css(".test2"));
        directive.hasFocusChanged(el.nativeElement);
        directive.hasFocusChanged(el2.nativeElement);
    });
});