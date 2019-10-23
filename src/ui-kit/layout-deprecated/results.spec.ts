import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { ResultsTemplateComponent } from './results.component';
import { ListResultsMessageComponent } from './list-results-message';
import { SamPaginationComponent } from '../components/pagination';
import { By } from '@angular/platform-browser';


describe('ResultsTemplateComponent component', () => {
  describe('rendered tests', () => {
    let component: ResultsTemplateComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResultsTemplateComponent,ListResultsMessageComponent,SamPaginationComponent]
      });
  
      fixture = TestBed.createComponent(ResultsTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should initialize', function () {
        fixture.detectChanges();
        expect(true).toBe(true);
    });
  });
});
