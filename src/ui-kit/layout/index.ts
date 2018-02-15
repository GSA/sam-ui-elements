import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SamComponentsModule } from '../components';
import { SamElementsModule } from '../elements';
import { SamDirectivesModule } from '../directives';

import { PageService } from './page.service';
import { PageTemplateComponent } from './page.component';
import { SidebarTemplateComponent } from './sidebar.component';
import { ResultsTemplateComponent } from './results.component';

/**
 * Grid
 */
import { GridDirective } from './grid/grid.directive';
import { RowDirective } from './grid/row.directive';
import { ColumnDirective } from './grid/column.directive';

/**
 * Pages
 */
import { FormStepComponent } from './pages/form-step.component';

/**
 * This will be replaced by the page templates above
 */
import {
  WorkspaceTemplateComponent
} from './workspace/workspace-template.component';

/**
 * Only <list-results-message> is needed
 * Good candidate to be a shared component
 */
import { ListResultsMessageComponent } from './list-results-message';
import { TitleAndSectionComponent } from './title-and-section.component';
import { FormOnlyPageTemplateComponent } from './form-only-page.component';


/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    WorkspaceTemplateComponent,
    PageTemplateComponent,
    SidebarTemplateComponent,
    ResultsTemplateComponent,
    FormOnlyPageTemplateComponent,
    FormStepComponent,
    GridDirective,
    RowDirective,
    ColumnDirective,
    TitleAndSectionComponent,
    ListResultsMessageComponent
  ],
  imports: [
    CommonModule,
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    RouterModule
  ],
  exports: [
    WorkspaceTemplateComponent,
    PageTemplateComponent,
    SidebarTemplateComponent,
    ResultsTemplateComponent,
    FormOnlyPageTemplateComponent,
    FormStepComponent,
    GridDirective,
    RowDirective,
    ColumnDirective,
    TitleAndSectionComponent,
  ],
  providers: [
    PageService
  ]
})
export class SamLayoutModule { }
