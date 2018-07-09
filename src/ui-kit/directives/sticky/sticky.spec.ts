import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamStickyComponent} from './sticky.component';

@Component({
  selector: 'test-cmp',
  template: `
  <div class="test-container">
    <div #var sam-sticky 
    [container]="'test-container'" 
    [limit]="600" class="test-comp">
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
  let directive: SamStickyComponent;
  let component: TestComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamStickyComponent, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(
        By.directive(SamStickyComponent)
      )
      .injector.get(SamStickyComponent);
  });

  it('should compile', () => {
    const comp = fixture.debugElement.query(By.css('.test-comp'));

    expect(comp.nativeElement.getAttribute('ng-reflect-limit'))
      .toContain('600');
  });

  it('should handle when resized', () => {
    directive.resize({});
    const comp = fixture.debugElement.query(By.css('.test-comp'));
    fixture.detectChanges();
    expect(comp.nativeElement.getAttribute('style')).toContain('position: static');
  });

  it('trigger on scroll', () => {
    const expectedLimit = 1400;
    spyOn(directive, 'scroll');
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(directive.scroll).toHaveBeenCalled();
    directive.scroll(undefined);
    directive.makeSticky();

    directive.limit = expectedLimit;
    directive.makeSticky();
  });
});
