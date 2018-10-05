import { NgModule } from '@angular/core';
import { SamAsideToggleModule } from './aside-toggle';
import { SamFiltersWrapperModule } from './filters-wrapper';
import { SamToolbarsModule } from './toolbar';

@NgModule({
    imports: [
        SamAsideToggleModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ],
    exports: [
        SamAsideToggleModule,
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ]
})
export class SamLayoutNextModule { }