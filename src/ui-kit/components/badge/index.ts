import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamBadgeComponent } from './badge.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamBadgeComponent ],
    exports: [ SamBadgeComponent ],
})
export class SamBadgeModule { }

export { BadgeConfig } from './types';
export { SamBadgeComponent } from './badge.component';
