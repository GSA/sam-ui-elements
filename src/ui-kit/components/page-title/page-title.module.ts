import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPageTitle } from './page-title.component';

@NgModule({
    imports: [CommonModule ],
    declarations: [ SamPageTitle ],
    exports: [ SamPageTitle ],
})
export class SamPageTitleModule { }