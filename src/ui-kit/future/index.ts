import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SamComponentsModule } from '../components';

import { SamBoxComponent } from './box';
import { SamContainerComponent } from './container';
import { SamHeadingComponent } from './heading';
import { SamIconComponent } from './icon';
import { SamListComponent } from './list';
import { SamMasterPageComponent } from './master-page';
import { SamPageComponent } from './page';
import { SamSidebarComponent } from './sidebar';
import { SamYoutubeComponent } from './youtube';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SamComponentsModule
  ],
  declarations: [
    SamBoxComponent,
    SamContainerComponent,
    SamHeadingComponent,
    SamIconComponent,
    SamListComponent,
    SamMasterPageComponent,
    SamPageComponent,
    SamSidebarComponent,
    SamYoutubeComponent
  ],
  exports: [
    SamBoxComponent,
    SamContainerComponent,
    SamHeadingComponent,
    SamIconComponent,
    SamListComponent,
    SamMasterPageComponent,
    SamPageComponent,
    SamSidebarComponent,
    SamYoutubeComponent
  ]
})
export class SamFutureModule { }


