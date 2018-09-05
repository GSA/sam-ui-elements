import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamBannerComponent } from './banner.component';

@NgModule({
    declarations: [ SamBannerComponent ],
    exports: [ SamBannerComponent ],
    imports: [CommonModule]
})
export class SamBannerModule { }

export { SamBannerComponent } from './banner.component';
