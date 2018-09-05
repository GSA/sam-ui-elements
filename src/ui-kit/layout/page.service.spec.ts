import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
// Load the implementations that should be tested
import { By } from '@angular/platform-browser';
import { PageService } from './page.service';


describe('PageService', () => {
  describe('isolated tests', () => {
    let service: PageService;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      service = new PageService();
    });
  
    it('should set a sidebar value', function () {
        service.sidebar = true;
        expect(service.sidebar).toBe(true);
        expect(service.sidebarColumns).toBe('3');
        expect(service.mainContentColumns).toBe('9');
        service.wideSidebar = true;
        expect(service.wideSidebar).toBe(true);
        expect(service.sidebarColumns).toBe('4');
        expect(service.mainContentColumns).toBe('8');
        service.sidebar = false;
        expect(service.sidebar).toBe(false);
        expect(service.sidebarColumns).toBe('');
        expect(service.mainContentColumns).toBe('12');
    });
  });
});
