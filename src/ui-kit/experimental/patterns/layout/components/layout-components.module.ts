import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { SamPageNextComponent } from './page/page.component';
import { MdSidenavModule } from './sidenav';
import { SamActionBarComponent } from './actionbar.component';
import { SamLayoutComponent } from './layout.component';
import { SamMainComponent } from './main.component';
import { SamDatabankPaginationComponent } from './pagination.component';
import { SamToolbarComponent } from './toolbar.component';
import {
  SamFeedbackWrapperComponent
} from './feedback-wrapper.component';
import {
  SamFiltersWrapperComponent
} from './filters-wrapper.component';
import {
  SamResourcesWrapperComponent
} from './resources-wrapper.component';
import {
  SamDatabankTitleSectionDirective
} from './title-section.component';
import { SamExperimentalModule } from '../../..';
import { MdExpansionModule } from './expansion';
import { SamPageTitle } from './main-section/page-title/page-title.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdSidenavModule,
    MdExpansionModule
  ],
  declarations: [
    SamActionBarComponent,
    SamLayoutComponent,
    SamMainComponent,
    SamDatabankPaginationComponent,
    SamToolbarComponent,
    SamFeedbackWrapperComponent,
    SamFiltersWrapperComponent,
    SamResourcesWrapperComponent,
    SamDatabankTitleSectionDirective,
    SamPageNextComponent,
    SamPageTitle
  ],
  exports: [
    MdExpansionModule,
    MdSidenavModule,
    SamActionBarComponent,
    SamLayoutComponent,
    SamMainComponent,
    SamDatabankPaginationComponent,
    SamToolbarComponent,
    SamFeedbackWrapperComponent,
    SamFiltersWrapperComponent,
    SamResourcesWrapperComponent,
    SamDatabankTitleSectionDirective,
    SamPageNextComponent,
    SamPageTitle
  ]
})
export class SamLayoutComponentsModule {}
