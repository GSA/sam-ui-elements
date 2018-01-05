import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { Component,ViewChild } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamStickyComponent} from './sticky.component';

@Component({
  selector: 'test-cmp',
  template: `
  <div class="test-container">
    <div #var sam-sticky 
    [container]="'test-container'" 
    [limit]="1200" class="test-comp">
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
    <div style="width:1300px;height:2000px;">
      content
    </div>
  </div>`
})
class TestComponent {
  @ViewChild('var') var;
}

describe('The Sam Sticky directive', () => {
  let directive:SamStickyComponent;
  let component:TestComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamStickyComponent,TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(SamStickyComponent)).injector.get(SamStickyComponent);
  });

  it('should compile', () => {
    let comp = fixture.debugElement.query(By.css('.test-comp'));
    expect(comp.nativeElement.getAttribute("ng-reflect-limit")).toContain("1200");
  });

  it('trigger on resize',()=>{
    spyOn(directive,'resize');
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(directive.resize).toHaveBeenCalled();
    directive.resize(null);
  });
  it('trigger on scroll',()=>{;
    spyOn(directive,'scroll');
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(directive.scroll).toHaveBeenCalled();
    directive.scroll(null);
    directive.makeSticky();

    directive.limit = 1400;
    directive.makeSticky();
  });
});