import { NgModule } from '@angular/core';
import { SamFiltersWrapperModule } from './filters-wrapper';

@NgModule({
    imports: [SamFiltersWrapperModule],
    exports: [ SamFiltersWrapperModule ]
})
export class SamLayoutNextModule { }