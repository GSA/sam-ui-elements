import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SamFormControlsModule } from '../form-controls';
import { SamDirectivesModule } from '../directives';
import { SamElementsModule } from '../elements';

import { AccordionsModule } from './accordion';
import { SamAlertComponent } from './alert';
import { SamAlertFooterComponent,SamAlertFooterService } from './alert-footer';
import { SamBannerComponent } from './banner';
import { SamBreadcrumbsComponent } from './breadcrumbs';
import { SamCollapsibleComponent } from './collapsible';
import { SamDownloadComponent } from './download';
import { SamFiltersContainerComponent } from './filters-container';
import { SamHeaderComponent } from './header';
import { SamHistoryComponent } from './history';
import { SamInfoAccordionComponent } from './info-accordion';
import { SamLabelComponent } from './label';
import { SamModalComponent } from './modal';
import { SamMultiSelectDropdownComponent } from './multiselect-dropdown';
import { SamPaginationComponent } from './pagination';
import { SamPointOfContactComponent } from './point-of-contact';
import { SamSidenavModule } from './sidenav';
import { SamSpinnerComponent } from './spinner';
import { SamTabsComponent,SamTabComponent } from './tabs';
import { SamWrapperModule } from '../wrappers';
import { SamCommentsModule } from './comments';
import { SamImageModule } from './image';
import { SamActionButton, SamActionsDropdownComponent } from './actions';

@NgModule({
  imports: [ 
    CommonModule,
    RouterModule,
    SamFormControlsModule,
    SamDirectivesModule,
    SamElementsModule,
    AccordionsModule,
    SamSidenavModule,
    SamWrapperModule,
    SamCommentsModule,
    SamImageModule
  ],
  declarations: [
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamCollapsibleComponent,
    SamDownloadComponent,
    SamFiltersContainerComponent,
    SamHeaderComponent,
    SamHistoryComponent,
    SamInfoAccordionComponent,
    SamLabelComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    SamActionButton,
    SamActionsDropdownComponent
  ],
  exports: [
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamCollapsibleComponent,
    SamDownloadComponent,
    SamFiltersContainerComponent,
    SamHeaderComponent,
    SamHistoryComponent,
    SamInfoAccordionComponent,
    SamLabelComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamSidenavModule,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    AccordionsModule,
    SamCommentsModule,
    SamImageModule,
    SamActionButton,
    SamActionsDropdownComponent
  ]
})
export class SamComponentsModule {}