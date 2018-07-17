import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

import { Paginator } from './paginator';

/**
 * The <sam-pagination> allows users to select a page
 */
@Component({
  selector: 'sam-databank-pagination',
  templateUrl: 'pagination.template.html'
})
export class SamDatabankPaginationComponent
  implements OnInit {

  public paginator: Paginator;

  /**
   * Sets the number of units per page
   */
  @Input() public get pageSize (): number | string {
    return this.paginator.getUnitsPerPage();
  }

  public set pageSize (size: number | string) {
    if (typeof size === 'number') {
      this.paginator.setUnitsPerPage(size);
    } else {
      this.paginator.setUnitsPerPage(parseInt(size, 10));
    }
    this.currentPage = this.paginator.getCurrentPage();
    this.unitsChange.emit(this.paginator.getUnitsPerPage());
  }
  /**
   * Options for selection
   */
  @Input() public options: any[];
  /**
   * Sets the disabled status of the component,
   * defaults to false
   */
  @Input() public disabled: boolean = false;
  /**
   * Shows the current page number
   */
  @Input() public currentPage: number = 1;
  /**
   * Total number of results. Used to calculate pagination
   * strings.
   */
  @Input() public totalUnits: number = 0;
  /**
   * @deprecated Use totalUnits instead --
   *  Showed the number of total pages
   */
  @Input() public totalPages: number = 0;
  /**
   * Id used with inputs
   */
  @Input() public id: string;
  /**
   * The type of units per page, e.g., Results, Items, etc
   */
  @Input() public unit: string = 'Items';
  /**
   * Event emitted when current page is changed
   */
  @Output() public pageChange = new EventEmitter<number>();
  /**
   * Event emitted when units per page is changed
   */
  @Output() public unitsChange = new EventEmitter<number>();
    
  private _defaultSize = 10;
  private _defaultOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];

  constructor () {
    this.options = this._defaultOptions;
    this._setupPagination();
  }

  public ngOnChanges (c: any) {
    if (c.unit) {
      this.paginator.unit = this.unit;
    }

    if (c.totalUnits) {
      this.paginator.setTotalUnits(this.totalUnits);
    }

    if (c.currentPage) {
      this.paginator.setCurrentPage(this.currentPage);
      this.currentPage = this.paginator.getCurrentPage();
    }
  }

  public ngOnInit () {
    this._emitInitialEvents();
  }

  public onNextClick() {
    this.paginator.nextPage();
    this._updatePage();
  }

  public onPreviousClick() {
    this.paginator.previousPage();
    this._updatePage();
  }

  public printDisplayingString (): string {
    return this.paginator.printDisplayingString();
  }

  public printPerPageString(): string {
    return this.paginator.printPerPageString()
  }

  private _setupPagination () {
    this.paginator = new Paginator(
      this.unit,
      this._defaultSize,
      this.totalUnits
    );
  }

  private _updatePage () {
    this.currentPage = this.paginator.getCurrentPage();
    this.pageChange.emit(this.currentPage);
  }

  private _emitInitialEvents () {
    this.pageChange.emit(this.paginator.getCurrentPage());
    this.unitsChange.emit(this.paginator.getUnitsPerPage());
  }
}
