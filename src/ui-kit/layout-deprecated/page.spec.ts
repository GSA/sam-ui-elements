import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
// Load the implementations that should be tested
import { By } from '@angular/platform-browser';
import { PageTemplateComponent } from './page.component';
import { SamStickyComponent } from '../directives/sticky/sticky.component';
import { SamSidenavModule } from '../components/sidenav';
import { SamBreadcrumbsComponent } from '../components/breadcrumbs';
import { SamAlertComponent } from '../components/alert';
import { SidebarTemplateComponent } from './sidebar.component';
import { GridDirective } from './grid/grid.directive';
import { ColumnDirective } from './grid/column.directive';
import { RowDirective } from './grid/row.directive';
import { TitleAndSectionComponent } from './title-and-section.component';
import { SamBadgeComponent } from '../components/badge';
import { SamElementsModule } from '../elements';


describe('PageTemplateComponent component', () => {
  describe('rendered tests', () => {
    let component: PageTemplateComponent;
    let fixture: any;
  
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
            imports: [
                SamElementsModule,
                SamSidenavModule,
                RouterTestingModule
            ],
            declarations: [
                PageTemplateComponent,
                SamStickyComponent,
                SamAlertComponent,
                SamBreadcrumbsComponent,
                SidebarTemplateComponent,
                GridDirective,
                ColumnDirective,
                RowDirective,
                TitleAndSectionComponent,
                SamBadgeComponent
            ]
      });
  
      fixture = TestBed.createComponent(PageTemplateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should initialize', function () {
        let text = fixture.debugElement.nativeElement.textContent;
        expect(true).toBe(true);
    });
  });
});
