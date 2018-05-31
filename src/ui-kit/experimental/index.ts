import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SamBoxComponent } from './box';
import { SamContainerComponent } from './container';
import { SamFilterDrawerItemComponent } from './filter-drawer';
import { SamFilterDrawerComponent } from './filter-drawer';
import { SamIconComponent } from './icon';
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
import { SamVideoPlayerComponent} from "./video-player";
import { SamInputMaskModule } from './input-mask';
import { SamDataTableModule } from './data-table';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SamInputMaskModule,
    SamDataTableModule
  ],
  declarations: [
    SamBoxComponent,
    SamContainerComponent,
    SamFilterDrawerItemComponent,
    SamFilterDrawerComponent,
    SamIconComponent,
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
    SamVideoPlayerComponent,
  ],
  exports: [
    SamBoxComponent,
    SamContainerComponent,
    SamFilterDrawerItemComponent,
    SamFilterDrawerComponent,
    SamIconComponent,
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
    SamVideoPlayerComponent,
    SamInputMaskModule,
    SamDataTableModule,
  ]
})
export class SamExperimentalModule { }


