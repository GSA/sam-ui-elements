import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [ SamBreadcrumbsComponent ],
    exports: [ SamBreadcrumbsComponent ],
})
export class SamBreadcrumbsModule { }

export { SamBreadcrumbsComponent } from './breadcrumbs.component';
