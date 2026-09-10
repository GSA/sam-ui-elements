import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  HostBinding,
  Input,
  OnChanges,
} from "@angular/core";
import { CdkTable, CDK_TABLE } from "@angular/cdk/table";

import {
  _DisposeViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from "@angular/cdk/collections";

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamTable = CdkTable;

/**
 * Wrapper for the CdkTable with Material design styles.
 *
 * `CDK_TABLE_TEMPLATE` is no longer exported from `@angular/cdk/table` as of
 * CDK 20 (the template is now inlined directly in `CdkTable`'s own
 * `@Component` decorator), so this is a local copy of that same template
 * kept in sync with `@angular/cdk/table`'s `CdkTable` component template.
 */
@Component({
  selector: "sam-datatable, table[sam-datatable]",
  template: `
    <ng-content select="caption" />
    <ng-content select="colgroup, col" />

    @if (_isServer) {
      <ng-content />
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet />
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet />
        <ng-container noDataRowOutlet />
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet />
      </tfoot>
    } @else {
      <ng-container headerRowOutlet />
      <ng-container rowOutlet />
      <ng-container noDataRowOutlet />
      <ng-container footerRowOutlet />
    }
  `,
  providers: [
    { provide: CdkTable, useExisting: SamDataTableComponent },
    { provide: CDK_TABLE, useExisting: SamDataTableComponent },
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SamDataTableComponent<T>
  extends _SamTable<T>
  implements OnChanges
{
  @Input() allowHorizontalScroll = false;
  @HostBinding("class.sam-datatable-horizontal") samTableHorizontalClass =
    this.allowHorizontalScroll;

  ngOnChanges(c) {
    if (c.allowHorizontalScroll) {
      this.samTableHorizontalClass = this.allowHorizontalScroll;
    }
  }
}
