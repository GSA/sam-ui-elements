import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { Component } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamStickyComponent} from './sticky.component';

@Component({
  selector: 'test-cmp',
  template: '<div class="test-container"><div sam-sticky [container]="test-container" [limit]="1200" class="test-comp"><ul><li>1</li><li>2</li><li>3</li></ul></div></div>'
})
class TestComponent {}

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

  });

  it('should compile', () => {
    fixture.detectChanges();
    let comp = fixture.debugElement.query(By.css('.test-comp'));
    expect(comp.nativeElement.getAttribute("ng-reflect-limit")).toContain("1200");
  });

});