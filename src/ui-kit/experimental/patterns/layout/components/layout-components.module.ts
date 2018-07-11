import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { SamPageNextComponent } from './page';
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
import { MdExpansionModule } from './expansion';
import { SamMainContentComponent } from './main-content.component';
import { SamContentOutletDirective } from './content-outlet.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdSidenavModule,
    MdExpansionModule
  ],
  declarations: [
    // Components
    SamActionBarComponent,
    SamLayoutComponent,
    SamMainComponent,
    SamMainContentComponent,
    SamDatabankPaginationComponent,
    SamToolbarComponent,
    SamFeedbackWrapperComponent,
    SamFiltersWrapperComponent,
    SamResourcesWrapperComponent,
    SamPageNextComponent,
    
    // Directives
    SamDatabankTitleSectionDirective,
    SamContentOutletDirective,

  ],
  exports: [
    // Modules
    MdExpansionModule,
    MdSidenavModule,

    // Components
    SamActionBarComponent,
    SamLayoutComponent,
    SamMainComponent,
    SamMainContentComponent,
    SamDatabankPaginationComponent,
    SamToolbarComponent,
    SamFeedbackWrapperComponent,
    SamFiltersWrapperComponent,
    SamResourcesWrapperComponent,
    SamPageNextComponent,

    // Directives
    SamDatabankTitleSectionDirective,
    SamContentOutletDirective,
  ]
})
export class SamLayoutComponentsModule {}
