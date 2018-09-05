import {
  TestBed,
  async,
  fakeAsync,
  tick, 
  ComponentFixture} from '@angular/core/testing';

import {
  Component,
  Output,
  ViewChild,
  EventEmitter, 
  DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {
  SamExternalLinkDirective
} from './external-link.directive';


@Component({
  template: `
    <a id="blank"
      target="_blank">
      Blank
      <span class="fa fa-external-link fa-sm"></span>
    </a>

    <a id="named"
      target="name">
      Named
    </a>

    <a id="hidden"
      target="hidden"
      hideIcon="true">
      Hidden
    </a>
  `
})
class TestComponent {}

describe('Sam External Link Directive', () => {
  let directive: SamExternalLinkDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  function findIcons (el) {
    return el.queryAll(By.css('.fa-external-link'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        SamExternalLinkDirective
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add external link text for 508 compliance',
    () => {
    const cmps =
      fixture.debugElement.queryAll(By.css('.usa-sr-only'));
    let el1 = cmps[0];
    let el2 = cmps[1];

    expect(el1.nativeElement.innerText)
      .toContain('(opens in new window)');
    expect(el2.nativeElement.innerText)
      .toContain('(opens in new window)');
  });

  it('should add external link icon when none is present',
    () => {
    const cmp =
      fixture.debugElement.query(By.css('#named')); 

    const icons = findIcons(cmp);

    expect(icons.length).toBe(icons.length);
  });

  it('should not add additional icons if one is present',
    () => {
    const cmp =
      fixture.debugElement.query(By.css('#named')); 

    const icons = findIcons(cmp);

    expect(icons.length).toBe(1);
  });

  it('should not add icon if hideIcon is true', () => {
    const cmp =
      fixture.debugElement.query(By.css("#hidden"));
    
    const icons = findIcons(cmp);

    expect(icons.length).toBe(0);
  });

});
