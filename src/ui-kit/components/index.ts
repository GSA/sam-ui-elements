import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SamFormControlsModule } from '../form-controls';
import { SamDirectivesModule } from '../directives';
import { SamElementsModule } from '../elements';

import { AccordionsModule } from './accordion';
import { SamAlertComponent } from './alert';
import { SamAlertFooterComponent, SamAlertFooterService } from './alert-footer';
import { SamBadgeComponent } from './badge';
import { SamBannerModule } from './banner';
import { SamBreadcrumbsModule } from './breadcrumbs';
import { SamDownloadComponent } from './download';
import { SamHeaderModule } from './header';
import { SamHistoryComponent } from './history';
import { SamModalModule } from './modal';
import { SamMultiSelectDropdownComponent } from './multiselect-dropdown';
import { SamPaginationComponent } from './pagination';
import { SamPipesModule } from '../pipes';
import { SamPointOfContactComponent } from './point-of-contact';
import { SamProgressModule } from './progress-bar';
import { SamSidenavModule } from './sidenav';
import { SamSpinnerComponent } from './spinner';
import { SamTabsComponent, SamTabComponent } from './tabs';
import { SamUploadModule } from './upload';
import { SamWrapperModule } from '../wrappers';
import { SamCommentsModule } from './comments';
import { SamImageModule } from './image';
import { SamActionButtonModule } from './actions/action-button';
import { SamActionsDropdownComponent } from './actions/actions-dropdown';
import { SamUploadComponentV2 } from './upload-v2/upload-v2.component';
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
  ],
  declarations: [
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBadgeComponent,
    SamDownloadComponent,
    SamHistoryComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    SamUploadComponentV2,
    SamActionsDropdownComponent,
  ],
  exports: [
    SamActionButtonModule,
    SamActionsDropdownComponent,
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBadgeComponent,
    SamBannerModule,
    SamBreadcrumbsModule,
    SamDownloadComponent,
    SamHeaderModule,
    SamHistoryComponent,
    SamModalModule,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamProgressModule,
    SamSidenavModule,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    SamUploadModule,
    SamUploadComponentV2,
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
