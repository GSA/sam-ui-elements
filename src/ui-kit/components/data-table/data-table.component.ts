import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  HostBinding,
  Input,
} from "@angular/core";
import {
  CDK_TABLE_TEMPLATE,
  CdkTable,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
  STICKY_POSITIONING_LISTENER,
  CDK_TABLE,
} from "@angular/cdk/table";

import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from "@angular/cdk/collections";

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamTable = CdkTable;

/**
 * Wrapper for the CdkTable with Material design styles.
 * Todo: revert back to using CDK_TABLE_TEMPLATE in a later version
 */
@Component({
  selector: "sam-datatable, table[sam-datatable]",
  template: CDK_TABLE_TEMPLATE,
  //   template: `
  //     <ng-container headerRowPlaceholder></ng-container>
  //     <ng-container rowPlaceholder></ng-container>
  //     <ng-content select="[rowFooterPlaceholder]"></ng-content>`,
  providers: [
    { provide: CdkTable, useExisting: SamDataTableComponent },
   { provide: CDK_TABLE, useExisting: SamDataTableComponent },
    // { provide: CdkTable },
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
  ],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamDataTableComponent<T> extends _SamTable<T> {
  @Input() allowHorizontalScroll = false;
  @HostBinding("class.sam-datatable-horizontal") samTableHorizontalClass = this
    .allowHorizontalScroll;

  ngOnChanges(c) {
    if (c.allowHorizontalScroll) {
      this.samTableHorizontalClass = this.allowHorizontalScroll;
    }
  }
}
function Directive(arg0: {
  selector: string;
  providers: { provide: any; useClass: any }[];
}) {
  throw new Error("Function not implemented.");
}
