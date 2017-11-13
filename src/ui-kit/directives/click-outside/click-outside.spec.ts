import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { Component,Output,ViewChild,EventEmitter } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamClickOutsideDirective} from './click-outside.directive';

@Component({
  selector: 'test-cmp',
  template: `
<div #var sam-click-outside
(clickOutside)="clickOutsideHandler()">
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
    clickOutsideHandler(){
        this.action.emit(true);
    }
}
describe('The Sam Click Outside directive', () => {
    let directive:SamClickOutsideDirective;
    let component:TestComponent;
    let fixture:any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamClickOutsideDirective,TestComponent],
      });
  
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.query(By.directive(SamClickOutsideDirective)).injector.get(SamClickOutsideDirective);
    });
  
    it('should compile', () => {
        expect(true).toBe(true);
    });

    it("should check for click outside", ()=>{
        component.action.subscribe(val=>{
            expect(val).toBe(true);
        });
        let el = fixture.debugElement.query(By.css(".test"));
        el.nativeElement.click();

        let el2 = fixture.debugElement.query(By.css(".test2"));
        el2.nativeElement.click();
    });
});