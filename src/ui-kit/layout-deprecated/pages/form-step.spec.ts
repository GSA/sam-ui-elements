import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
// Load the implementations that should be tested
import { FormStepComponent } from './form-step.component';
import { By } from '@angular/platform-browser';
import { SamStickyComponent } from '../../directives/sticky/sticky.component';
import { SamSidenavModule } from '../../components/sidenav';
import { SamBreadcrumbsComponent } from '../../components/breadcrumbs';
import { SamAlertComponent } from '../../components/alert';
import { PageTemplateComponent } from '../page.component';
import { SidebarTemplateComponent } from '../sidebar.component';
import { GridDirective } from '../grid/grid.directive';
import { ColumnDirective } from '../grid/column.directive';
import { RowDirective } from '../grid/row.directive';
import { TitleAndSectionComponent } from '../title-and-section.component';
import { SamBadgeComponent } from '../../components/badge';
import { SamElementsModule } from '../../elements';
import { data } from '../../components/sidenav/services/testdata'; 


describe('Form Step Component', () => {
  describe('rendered tests', () => {
    let component: FormStepComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SamElementsModule,SamSidenavModule,RouterTestingModule],
            declarations: [
                FormStepComponent,
                SamStickyComponent,
                SamAlertComponent,
                SamBreadcrumbsComponent,
                SidebarTemplateComponent,
                GridDirective,
                ColumnDirective,
                RowDirective,
                TitleAndSectionComponent,
                SamBadgeComponent,
                PageTemplateComponent]
        });
  
        fixture = TestBed.createComponent(FormStepComponent);
        component = fixture.componentInstance;
        component.sideNavModel = data;
        component.tabsComponent = {
            toggleButtonOnErrors: false
        };
        fixture.detectChanges(); // trigger initial data binding
    });
  
    it('should initialize', function () {
        fixture.detectChanges();
        expect(true).toBe(true);
    });

    it('should toggle buttons', () =>{
        component.toggleButtons(true);
        expect(component.tabsComponent.toggleButtonOnErrors).toBe(true);
        component.toggleButtons(false);
        expect(component.tabsComponent.toggleButtonOnErrors).toBe(false);
        component.hasErrors = true;
        component.ngOnChanges();
        expect(component.tabsComponent.toggleButtonOnErrors).toBe(true);
    });

    it('should have emitters', () =>{
        component.breadcrumbOut.subscribe(() => {
            expect(true).toBe(true);
        });
        component.breadcrumbChange.subscribe(() => {
            expect(true).toBe(true);
        });
        component.action.subscribe(() => {
            expect(true).toBe(true);
        });
        component.sideNavOutput.subscribe(() => {
            expect(true).toBe(true);
        });
        component.sideNavChange.subscribe(() => {
            expect(true).toBe(true);
        });
        component.breadcrumbHandler({});
        component.formAction({});
        component.navHandler({});
    });
  });
});
