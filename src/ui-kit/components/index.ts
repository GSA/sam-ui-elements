import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SamFormControlsModule } from '../form-controls';
import { SamDirectivesModule } from '../directives';
import { SamElementsModule } from '../elements';

import { AccordionsModule } from './accordion';
import { SamAlertModule } from './alert';
import { SamAlertFooterModule } from './alert-footer';
import { SamBadgeModule } from './badge';
import { SamBannerModule } from './banner';
import { SamBreadcrumbsModule } from './breadcrumbs';
import { SamDownloadModule } from './download';
import { SamHeaderModule } from './header';
import { SamHistoryModule } from './history';
import { SamModalModule } from './modal';
import { SamMultiSelectDropdownModule } from './multiselect-dropdown';
import { SamPaginationModule } from './pagination';
import { SamPipesModule } from '../pipes';
import { SamPointOfContactModule } from './point-of-contact';
import { SamProgressModule } from './progress-bar';
import { SamSidenavModule } from './sidenav';
import { SamSpinnerModule } from './spinner';
import { SamTabsModule } from './tabs';
import { SamUploadModule } from './upload';
import { SamWrapperModule } from '../wrappers';
import { SamCommentsModule } from './comments';
import { SamImageModule } from './image';
import { SamActionButtonModule } from './actions/action-button';
import { SamActionDropdownModule } from './actions/actions-dropdown';
import { SamUploadV2Module } from './upload-v2';
import { SamDataTableModule } from './data-table';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SamFormControlsModule,
    SamDirectivesModule,
    SamElementsModule,
    AccordionsModule,
    SamPipesModule,
    SamSidenavModule,
    SamWrapperModule,
    SamCommentsModule,
    SamImageModule,
    SamDataTableModule,
    SamBannerModule,
    SamHeaderModule,
    SamModalModule,
    SamBreadcrumbsModule,
    SamUploadModule,
    SamProgressModule,
    SamActionButtonModule,
    SamActionDropdownModule,
    SamAlertModule,
    SamAlertFooterModule,
    SamBadgeModule,
    SamDownloadModule,
    SamHistoryModule,
    SamMultiSelectDropdownModule,
    SamPaginationModule,
    SamPointOfContactModule,
    SamSpinnerModule,
    SamTabsModule,
    SamUploadV2Module,
  ],
  declarations: [
    
  ],
  exports: [
    SamActionButtonModule,
    SamActionDropdownModule,
    SamAlertModule,
    SamAlertFooterModule,
    SamBadgeModule,
    SamBannerModule,
    SamBreadcrumbsModule,
    SamDownloadModule,
    SamHeaderModule,
    SamHistoryModule,
    SamModalModule,
    SamMultiSelectDropdownModule,
    SamPaginationModule,
    SamPointOfContactModule,
    SamProgressModule,
    SamSidenavModule,
    SamSpinnerModule,
    SamTabsModule,
    SamUploadModule,
    SamUploadV2Module,
    AccordionsModule,
    SamCommentsModule,
    SamImageModule,
    SamDataTableModule,
  ]
})
export class SamComponentsModule {}

export * from './accordion';
export * from './actions';
export * from './alert';
export * from './alert-footer';
export * from './badge';
export * from './banner';
export * from './breadcrumbs';
export * from './comments';
export * from './data-table';
export * from './download';
export * from './header';
export * from './history';
export * from './image';
export * from './modal';
export * from './multiselect-dropdown';
export * from './pagination';
export * from './point-of-contact';
export * from './sidenav';
export * from './spinner';
export * from './tabs';
export * from './upload';
export { SamUploadComponentV2 } from './upload-v2';
