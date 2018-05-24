import {ChangeDetectionStrategy, Component,
    ViewEncapsulation, HostBinding} from '@angular/core';
import {CDK_TABLE_TEMPLATE, CdkTable} from '@angular/cdk';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamTable = CdkTable;

/**
 * Wrapper for the CdkTable with Material design styles.
 * Todo: revert back to using CDK_TABLE_TEMPLATE in a later version
 */
@Component({
  selector: 'sam-datatable',
  template: `
  <div class="sam-datatable-thead">
  <ng-container headerRowPlaceholder></ng-container>
  </div>
  <div class="sam-datatable-tbody">
  <ng-container rowPlaceholder></ng-container>
  </div>
  <ng-content select="[rowFooterPlaceholder]"></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamDataTableComponent<T> extends _SamTable<T> {
    @HostBinding('class.sam-table') samTableClass = true;
}
