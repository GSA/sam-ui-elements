import { NgModule } from '@angular/core';
import {
    SamFilterDrawerModule
} from './filter-drawer';
import { SamFiltersWrapperModule } from './filters-wrapper';
import { SamToolbarsModule } from './toolbar';
import { SamPaginationNextModule } from './pagination/pagination.module';
import { SamPageModule } from './page/page.module';

@NgModule({
    imports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
        SamPaginationNextModule,
        SamPageModule
    ],
    exports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
        SamPaginationNextModule,
        SamPageModule
    ]
})
export class SamLayoutNextModule { }