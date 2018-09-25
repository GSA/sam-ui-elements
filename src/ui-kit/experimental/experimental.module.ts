import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SamBoxComponent } from './box';
import { SamContainerComponent } from './container';
import {
  SamFilterDrawerModule
} from './filter-drawer';
import { SamIconsModule } from './icon';
import { SamLabelNextComponent } from './label';
import { SamLayoutComponent } from './layout';
import { SamLayoutContentComponent } from './layout';
import { SamLayoutImgComponent } from './layout';
import { SamListComponent } from './list';
import { SamListItemComponent } from './list';
import { SamMasterPageComponent } from './master-page';
import { SamPageComponent } from './page';
import { SamSearchComponent } from './search';
import { SamPageSidebarComponent } from './page';
import { SamTitleComponent } from './title';
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
    SamFilterDrawerModule,
    SamAlertNextModule
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
    SamPageComponent,
    SamSearchComponent,
    SamPageSidebarComponent,
    SamTitleComponent,
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
    SamPageComponent,
    SamSearchComponent,
    SamPageSidebarComponent,
    SamTitleComponent,
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
    SamFilterDrawerModule,
    SamAlertNextModule
  ]
})
export class SamExperimentalModule {}
