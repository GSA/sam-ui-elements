import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';



import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import { Paginator } from './paginator';

/**
 * The <sam-pagination> allows users to select a page
 */
@Component({
  selector: 'sam-pagination-next',
  templateUrl: 'pagination.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamPaginationNextComponent implements OnInit {

  public paginator: Paginator;

  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

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
   * Sets the default size of the units displayed
   * Defaults to 10
   */
  @Input() public defaultSize = 10;
  /**
   * Event emitted when current page is changed
   */
  @Output() public pageChange = new EventEmitter<number>();
  /**
   * Event emitted when units per page is changed
   */
  @Output() public unitsChange = new EventEmitter<number>();

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

  public ngOnChanges (c: SimpleChanges): void {
    this._processChanges(c);
  }

  public ngOnInit (): void {
    this._emitInitialEvents();
  }

  public onNextClick(): void {
    this.paginator.nextPage();
    this._updatePage();
  }

  public onPreviousClick(): void {
    this.paginator.previousPage();
    this._updatePage();
  }

  public printDisplayingString (): string {
    return this.paginator.printDisplayingString();
  }

  public printPerPageString(): string {
    return this.paginator.printPerPageString()
  }

  private _processChanges (c: SimpleChanges): void {

    if (c.defaultSize) {
      this.paginator.setUnitsPerPage(this.defaultSize);
    }
    
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

  private _setupPagination (): void {
    this.paginator = new Paginator(
      this.unit,
      this.defaultSize,
      this.totalUnits
    );
  }

  private _updatePage (): void {
    this.currentPage = this.paginator.getCurrentPage();
    this.pageChange.emit(this.currentPage);
  }

  private _emitInitialEvents (): void {
    this.pageChange.emit(this.paginator.getCurrentPage());
    this.unitsChange.emit(this.paginator.getUnitsPerPage());
  }
}
