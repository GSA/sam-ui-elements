import { NgModule } from '@angular/core';
import { SamFiltersWrapperModule } from './filters-wrapper';
import { SamToolbarsModule } from './toolbar';

@NgModule({
    imports: [
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ],
    exports: [
        SamFiltersWrapperModule,
        SamToolbarsModule,
    ]
})
export class SamLayoutNextModule { }