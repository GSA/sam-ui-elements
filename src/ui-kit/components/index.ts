import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionsModule } from './accordion';
import { SamAlertComponent } from './alert';
import { SamBannerComponent } from './banner';
import { SamHeaderComponent } from './header';
import { SamLabelComponent } from './label';
import { SamModalComponent } from './modal';
import { SamMultiSelectDropdownComponent } from './multiselect-dropdown';
import { SamPaginationComponent } from './pagination';
import { SamPointOfContactComponent } from './point-of-contact';
import { SamSearchHeaderComponent } from './search-header';
import { SamTabComponent } from './tabs';
import { SamWrapperModule } from './wrapper';

@NgModule({
  imports: [ 
    CommonModule,
    AccordionsModule,
    SamWrapperModule 
  ],
  declarations: [
    SamAlertComponent,
    SamBannerComponent,
    SamHeaderComponent,
    SamLabelComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamSearchHeaderComponent,
    SamTabComponent,
  ],
  exports: [
    SamAlertComponent,
    SamBannerComponent,
    SamHeaderComponent,
    SamLabelComponent,
    SamModalComponent,
    SamMultiSelectDropdownComponent,
    SamPaginationComponent,
    SamPointOfContactComponent,
    SamSearchHeaderComponent,
    SamTabComponent,
  ]
})
export class SamComponentsModule {}