import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { SidebarTemplateComponent } from './sidebar.component';
import { PageService } from './page.service';
import { By } from '@angular/platform-browser';


describe('SidebarTemplateComponent component', () => {
  describe('rendered tests', () => {
    let component: SidebarTemplateComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarTemplateComponent],
        providers:[PageService]
      });
  
      fixture = TestBed.createComponent(SidebarTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should initialize', function () {
        fixture.detectChanges();
        expect(true).toBe(true);
    });
  });
});
