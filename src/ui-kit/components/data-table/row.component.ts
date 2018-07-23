import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {CdkHeaderRow, CdkRow, CDK_ROW_TEMPLATE} from '@angular/cdk';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamHeaderRow = CdkHeaderRow;
export const _SamRow = CdkRow;

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sam-header-row',
  template: CDK_ROW_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamHeaderRowComponent extends _SamHeaderRow {
    @HostBinding('class.sam-header-row') samHeaderRowClass = true;
    @HostBinding('attr.role') roleAttr = 'row';
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'sam-row',
  template: CDK_ROW_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamRowComponent extends _SamRow {
    @HostBinding('class.sam-row') samRowClass = true;
    @HostBinding('attr.role') roleAttr = 'row';
 }
