import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import {SamDataTableComponent} from './data-table.component';
import {SamCellDirective, SamHeaderCellDirective} from './cell.component';
import {SamHeaderRowComponent, SamRowComponent} from './row.component';
import {SamSortHeaderComponent, SamSortHeaderIntl} from './sort-header.component';
import {SamSortDirective} from './sort.directive';


export * from './cell.component';
export * from './data-table.component';
export * from './row.component';
export * from './sort-header.component';
export * from './sort.directive';

@NgModule({
  imports: [CdkTableModule, CommonModule],
  exports: [SamDataTableComponent, SamHeaderCellDirective, SamCellDirective,
    SamHeaderRowComponent, SamRowComponent, SamSortDirective, SamSortHeaderComponent, CdkTableModule],
  declarations: [SamDataTableComponent, SamHeaderCellDirective, SamCellDirective,
    SamHeaderRowComponent, SamRowComponent, SamSortDirective, SamSortHeaderComponent],
  providers: [SamSortHeaderIntl]
})
export class SamDataTableModule {}
