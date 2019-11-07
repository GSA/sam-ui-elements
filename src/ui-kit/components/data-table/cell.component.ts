import {Directive, ElementRef, Renderer2, HostBinding} from '@angular/core';
import {CdkCell, CdkColumnDef, CdkHeaderCell} from '@angular/cdk/table';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _SamHeaderCellBase = CdkHeaderCell;
export const _SamCell = CdkCell;

/** Header cell template container that adds the right classes and role. */
/* tslint:disable */
@Directive({
  selector: 'sam-header-cell, th[sam-header-cell]'
})
/* tslint:enable */
export class SamHeaderCellDirective extends _SamHeaderCellBase {
    @HostBinding('class.sam-header-cell') samCellClass = true;
    @HostBinding('attr.role') roleAttr = 'columnheader';
    @HostBinding('attr.scope') scopeAttr = 'col';
    constructor(columnDef: CdkColumnDef,
            elementRef: ElementRef,
            renderer: Renderer2) {
        super(columnDef, elementRef);
        renderer.addClass(elementRef.nativeElement, `sam-column-${columnDef.name}`);
    }
}

/** Cell template container that adds the right classes and role. */
/* tslint:disable */
@Directive({
  selector: 'sam-cell, td[sam-cell]'
})
/* tslint:enable */
export class SamCellDirective extends _SamCell {
    @HostBinding('class.sam-cell') samCellClass = true;
    @HostBinding('attr.role') roleAttr = 'gridcell';
    constructor(columnDef: CdkColumnDef,
            elementRef: ElementRef,
            renderer: Renderer2) {
        super(columnDef, elementRef);
        renderer.addClass(elementRef.nativeElement, `sam-column-${columnDef.name}`);
    }
}
