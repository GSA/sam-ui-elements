import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SamFormControlsModule } from '../form-controls';
import { SamDirectivesModule } from '../directives';

import { AccordionsModule } from './accordion';
import { SamAlertComponent } from './alert';
import { SamAlphabetSelectorComponent } from './alphabet-selector';
import { SamBannerComponent } from './banner';
import { SamBreadcrumbsComponent } from './breadcrumbs';
import { SamCollapsibleComponent } from './collapsible';
import { SamDownloadComponent } from './download';
import { SamFiltersContainerComponent } from './filters-container';
import { SamHeaderComponent } from './header';
import { SamHeaderMenuComponent } from './header-menu';
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

@NgModule({
  imports: [ 
    CommonModule,
    RouterModule,
    SamFormControlsModule,
    SamDirectivesModule,
    AccordionsModule,
    SamSidenavModule,
    SamWrapperModule 
  ],
  declarations: [
    SamAlertComponent,
    SamAlphabetSelectorComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamCollapsibleComponent,
    SamDownloadComponent,
    SamFiltersContainerComponent,
    SamHeaderComponent,
    SamHeaderMenuComponent,
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
  ],
  exports: [
    SamAlertComponent,
    SamAlphabetSelectorComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamCollapsibleComponent,
    SamDownloadComponent,
    SamFiltersContainerComponent,
    SamHeaderComponent,
    SamHeaderMenuComponent,
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
    AccordionsModule
  ]
})
export class SamComponentsModule {}