import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChipHostDirective } from './chip-host';
import { DynamicChipsDirective } from './dynamic-chips';
import { SamFilterDrawerChip } from './filter-drawer-chip';
import {
  SamFilterDrawerItemComponent
} from './filter-drawer-item';
import {
  SamFilterDrawerComponent
} from './filter-drawer.component';
import { SamButtonNextModule } from '../../experimental/button-next';

@NgModule({
  imports: [
    CommonModule,
    SamButtonNextModule
  ],
  declarations: [
    ChipHostDirective,
    DynamicChipsDirective,
    SamFilterDrawerChip,
    SamFilterDrawerItemComponent,
    SamFilterDrawerComponent
  ],
  exports: [
    ChipHostDirective,
    DynamicChipsDirective,
    SamFilterDrawerChip,
    SamFilterDrawerItemComponent,
    SamFilterDrawerComponent
  ],
  // entryComponents: [
  //   SamFilterDrawerItemComponent
  // ]
})
export class SamFilterDrawerModule {}