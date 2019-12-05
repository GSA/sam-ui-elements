import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SamBoxComponent } from './box';
import { SamContainerComponent } from './container';
import { SamIconsModule } from './icon';
import { SamLabelNextComponent } from './label';
import { SamLayoutComponent } from './layout';
import { SamLayoutContentComponent } from './layout';
import { SamLayoutImgComponent } from './layout';
import { SamListComponent } from './list';
import { SamListItemComponent } from './list';
import { SamMasterPageComponent } from './master-page';
import { SamSearchComponent } from './search';
import { SamYoutubeComponent } from './youtube';
import { SamPickerComponent, SamPopoverComponent } from './picker';
import { SamVideoPlayerModule } from './video-player';
import { SamInputMaskModule } from './input-mask';
import { SamLayoutComponentsModule } from './patterns';
import { SamDollarComponent } from './dollar';
import { SamWrapperModule } from '../wrappers';
import { SamActionsListModule } from './actions-list';
import { SamButtonNextModule } from './button-next';
import { SamTabsNextModule } from './tabs';
import { SamAlertNextModule } from './alert';
import { SamTitleModule } from './title';
import { SamHierarchicalModule } from './hierarchical/hierarchical.module';
import { SamCardModule } from './card';
import { SamSegmentModule } from './segment';
import { SamProgressModule } from './progress/progress.module';
import { SamListboxModule } from './listbox/listbox.module';
import { SamSideNavigationToolbarModule } from './sideNavigationToolbar/sideNavigationToolbar.module';
import { SamDateRangeV2Module } from './date-range-v2/date-range-v2.module';
import { SdsSortModule } from './sort';
import { SdsPaginationModule } from './pagination/sds-pagination.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SamInputMaskModule,
    SamLayoutComponentsModule,
    FormsModule,
    SamWrapperModule,
    SamActionsListModule,
    SamIconsModule,
    SamButtonNextModule,
    SamVideoPlayerModule,
    SamTabsNextModule,
    SamAlertNextModule,
    SamTitleModule,
    SamHierarchicalModule,
    SamListboxModule,
    SamCardModule,
    SamSegmentModule,
    SamProgressModule,
    SamSideNavigationToolbarModule

  ],
  declarations: [
    SamBoxComponent,
    SamContainerComponent,
    SamLabelNextComponent,
    SamLayoutComponent,
    SamLayoutContentComponent,
    SamLayoutImgComponent,
    SamListComponent,
    SamListItemComponent,
    SamMasterPageComponent,
    SamSearchComponent,
    SamYoutubeComponent,
    SamPopoverComponent,
    SamPickerComponent,
    SamDollarComponent,
  ],
  exports: [
    SamBoxComponent,
    SamContainerComponent,
    SamLabelNextComponent,
    SamLayoutComponent,
    SamLayoutContentComponent,
    SamLayoutImgComponent,
    SamListComponent,
    SamListItemComponent,
    SamMasterPageComponent,
    SamSearchComponent,
    SamYoutubeComponent,
    SamPopoverComponent,
    SamPickerComponent,
    SamVideoPlayerModule,
    SamInputMaskModule,
    SamLayoutComponentsModule,
    SamDollarComponent,
    SamActionsListModule,
    SamIconsModule,
    SamButtonNextModule,
    SamTabsNextModule,
    SamAlertNextModule,
    SamTitleModule,
    SamHierarchicalModule,
    SamListboxModule,
    SamCardModule,
    SamSegmentModule,
    SamProgressModule,
    SamDateRangeV2Module,
    SamSideNavigationToolbarModule,
    SdsSortModule,
    SdsPaginationModule
  ]
})
export class SamExperimentalModule { }
