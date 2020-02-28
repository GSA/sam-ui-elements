import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { RowDirective } from './row.directive';
import { By } from '@angular/platform-browser';

@Component({
    template: `<div row></div>` 
})
class TestComponent {}

describe('Row Directive', () => {
  describe('rendered tests', () => {
    let component: TestComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, RowDirective]
      });
  
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    });
  
    it('Get row class value', function () {
      fixture.detectChanges();
      let str = fixture.debugElement.query(By.css('div'));
      expect(str.nativeElement.getAttribute('class')).toContain('row');
    });
  });
});
