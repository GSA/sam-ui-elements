import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    HostBinding,
    Input
} from '@angular/core';
import { CDK_TABLE_TEMPLATE, CdkTable } from '@angular/cdk/table';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamTable = CdkTable;

/**
 * Wrapper for the CdkTable with Material design styles.
 * Todo: revert back to using CDK_TABLE_TEMPLATE in a later version
 */
@Component({
    selector: 'sam-datatable, table[sam-datatable]',
    template: CDK_TABLE_TEMPLATE,
//   template: `
//     <ng-container headerRowPlaceholder></ng-container>
//     <ng-container rowPlaceholder></ng-container>
//     <ng-content select="[rowFooterPlaceholder]"></ng-content>`,
    providers: [{ provide: CdkTable }],  
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamDataTableComponent<T> extends _SamTable<T> {
    @Input() allowHorizontalScroll = false;
    @HostBinding('class.sam-datatable-horizontal') samTableHorizontalClass = this.allowHorizontalScroll;

    ngOnChanges(c) {
        if (c.allowHorizontalScroll) {
            this.samTableHorizontalClass = this.allowHorizontalScroll;
        }
    }
}
