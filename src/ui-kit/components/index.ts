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
import { SamBannerComponent } from './banner';
import { SamBreadcrumbsComponent } from './breadcrumbs';
import { SamDownloadComponent } from './download';
import { SamHeaderComponent } from './header';
import { SamHistoryComponent } from './history';
import { SamModalComponent } from './modal';
import { SamMultiSelectDropdownComponent } from './multiselect-dropdown';
import { SamPaginationComponent } from './pagination';
import { SamPipesModule } from '../pipes';
import { SamPointOfContactComponent } from './point-of-contact';
import { SamProgress } from './progress-bar/progress-bar.component';
import { SamSidenavModule } from './sidenav';
import { SamSpinnerComponent } from './spinner';
import { SamTabsComponent, SamTabComponent } from './tabs';
import { SamUploadComponent } from './upload/upload.component';
import { SamWrapperModule } from '../wrappers';
import { SamCommentsModule } from './comments';
import { SamImageModule } from './image';
import { SamActionButton} from './actions/action-button';
import { SamActionsDropdownComponent } from './actions/actions-dropdown';
import { SamUploadComponentV2 } from './upload-v2/upload-v2.component';
import { SamActionsListComponent } from './actions-list';

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
  ],
  declarations: [
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBadgeComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamDownloadComponent,
    SamHeaderComponent,
    SamHistoryComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamProgress,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    SamUploadComponent,
    SamUploadComponentV2,
    SamActionButton,
    SamActionsDropdownComponent,
    SamActionsListComponent
  ],
  exports: [
    SamActionButton,
    SamActionsDropdownComponent,
    SamAlertComponent,
    SamAlertFooterComponent,
    SamBadgeComponent,
    SamBannerComponent,
    SamBreadcrumbsComponent,
    SamDownloadComponent,
    SamHeaderComponent,
    SamHistoryComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamProgress,
    SamSidenavModule,
    SamSpinnerComponent,
    SamTabsComponent,
    SamTabComponent,
    SamUploadComponent,
    SamUploadComponentV2,
    AccordionsModule,
    SamCommentsModule,
    SamImageModule,
    SamActionsListComponent
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
export * from './actions-list';
export { SamUploadComponentV2 } from './upload-v2';
