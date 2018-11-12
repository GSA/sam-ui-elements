import { NgModule } from '@angular/core';
import {
    SamFilterDrawerModule
} from './filter-drawer';
import { SamFiltersWrapperModule } from './filters-wrapper';
import { SamToolbarsModule } from './toolbar';
import { SamPaginationNextModule } from './pagination/pagination.module';

@NgModule({
    imports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
        SamPaginationNextModule
    ],
    exports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
        SamPaginationNextModule
    ]
})
export class SamLayoutNextModule { }