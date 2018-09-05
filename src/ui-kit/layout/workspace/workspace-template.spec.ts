import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { WorkspaceTemplateComponent } from './workspace-template.component';
import { By } from '@angular/platform-browser';


describe('Workspace template component', () => {
  describe('rendered tests', () => {
    let component: WorkspaceTemplateComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WorkspaceTemplateComponent]
      });
  
      fixture = TestBed.createComponent(WorkspaceTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should initialize', function () {
        fixture.detectChanges();
        expect(true).toBe(true);
    });
  });
});
