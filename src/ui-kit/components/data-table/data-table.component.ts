import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    HostBinding,
    Input
} from '@angular/core';
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
  <table class="sam-table sam large table">
    <ng-container headerRowPlaceholder></ng-container>
    <ng-container rowPlaceholder></ng-container>
    <ng-content select="[rowFooterPlaceholder]"></ng-content>
  </table>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamDataTableComponent<T> extends _SamTable<T> {
    @Input() allowHorizontalScroll = false;
    @HostBinding('class.sam-datatable-horizontal') samTableHorizontalClass = this.allowHorizontalScroll;

    ngOnChanges(c){
        if(c.allowHorizontalScroll){
            this.samTableHorizontalClass = this.allowHorizontalScroll;
        }
    }
}
