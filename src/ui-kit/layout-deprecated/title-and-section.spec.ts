import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { TitleAndSectionComponent } from './title-and-section.component';
import { By } from '@angular/platform-browser';
import { SamBadgeComponent } from '../components/badge';
import { SamElementsModule } from '../elements';


describe('TitleAndSectionComponent component', () => {
  describe('rendered tests', () => {
    let component: TitleAndSectionComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamElementsModule],
        declarations: [TitleAndSectionComponent,SamBadgeComponent]
      });
  
      fixture = TestBed.createComponent(TitleAndSectionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should initialize', function () {
        fixture.detectChanges();
        expect(true).toBe(true);
    });
  });
});
