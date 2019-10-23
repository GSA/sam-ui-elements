import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { By } from '@angular/platform-browser';
import { ListResultsMessageComponent } from './list-results-message';


describe('ListResultsMessage component', () => {
  describe('rendered tests', () => {
    let component: ListResultsMessageComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ListResultsMessageComponent]
      });
  
      fixture = TestBed.createComponent(ListResultsMessageComponent);
      component = fixture.componentInstance;
      component.total = 23;
      component.currentPage=2;
      component.showing = 10;
      component.ngOnChanges();
      fixture.detectChanges();
    });
  
    it('should display a message', function () {
        let text = fixture.debugElement.nativeElement.textContent;
        expect(text).toBe("Showing 11 - 20 of 23 results");
    });
    it('should allow a suffix', function () {
        component.suffix = "records";
        component.ngOnChanges();
        fixture.detectChanges();
        let text = fixture.debugElement.nativeElement.textContent;
        expect(text).toBe("Showing 11 - 20 of 23 records");
    });
    it('should handle showing less than total', function () {
        component.total = 7;
        component.ngOnChanges();
        fixture.detectChanges();
        let text = fixture.debugElement.nativeElement.textContent;
        expect(text).toBe("Showing 1 - 7 of 7 results");
    });
  });
});
