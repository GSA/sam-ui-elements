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
    <a id="blank" target="_blank">Blank</a>
    <a id="named" target="name">Named</a>
  `
})
class TestComponent {}

fdescribe('Sam External Link Directive', () => {
  let directive: SamExternalLinkDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

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
    const cmps: DebugElement[] =
      fixture.debugElement.queryAll(By.css('.usa-sr-only'));
    let el1 = cmps[0];
    let el2 = cmps[1];

    expect(el1.nativeElement.innerText)
      .toContain('(opens in new window)');
    expect(el2.nativeElement.innerText)
      .toContain('(opens in new window)');
  })
});
