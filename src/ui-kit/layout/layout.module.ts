import { NgModule } from '@angular/core';
import {
    SamFilterDrawerModule
} from './filter-drawer';
import { SamFiltersWrapperModule } from './filters-wrapper';
import { SamToolbarsModule } from './toolbar';

@NgModule({
    imports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ],
    exports: [
        SamFilterDrawerModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ]
})
export class SamLayoutNextModule { }