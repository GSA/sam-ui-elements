import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * The <sam-pagination> allows users to select a page
 */
@Component({
  selector: 'sam-databank-pagination',
  template: `
    <nav class="sam pagination"
      role="navigation"
      aria-label="Pagination">
      <ul [ngClass]="disabled && 'disabled'">
        <li *ngIf="showPrevious()">
          <a tabindex="0"
            aria-label="previous"
            (click)="onPreviousClick()"
            (keyup.enter)="onPreviousClick()">
            <span class="fa fa-angle-left"
              aria-hidden="true"
            ></span>
              Prev
          </a>
        </li>
        <li>
          <a tabindex="0"
            [ngClass]="textDecoration(1)"
            (click)="onPageClick(1)"
            [attr.aria-label]="getAriaLabel(1)"
            (keyup.enter)="onPageClick(1)">
            1
          </a>
        </li>
          <li *ngIf="showFirstEllipsis()">
            &hellip;
          </li>
          <li *ngFor="let i of consecutivePageRange()">
            <a tabindex="0"
              [ngClass]="textDecoration(i)"
              (click)="onPageClick(i)"
              [attr.aria-label]="getAriaLabel(i)"
              (keyup.enter)="onPageClick(i)">{{i}}
            </a>
          </li>
          <li *ngIf="showLastEllipsis()">
              &hellip;
          </li>
          <li *ngIf="!dontShowLast && showLastButton()">
            <a tabindex="0"
              [ngClass]="textDecoration(totalPages)"
              (click)="onPageClick(totalPages)"
              [attr.aria-label]="getAriaLabel(totalPages)"
              (keyup.enter)="onPageClick(totalPages)">
              {{totalPages}}
            </a>
          </li>
          <li *ngIf="showNext()">
            <a tabindex="0"
              aria-label="next"
              (click)="onNextClick()"
              (keyup.enter)="onNextClick()">
              Next
              <span class="fa fa-angle-right"
                aria-hidden="true"
              ></span>
            </a>
          </li>
        </ul>
    </nav>
`,
})
export class SamDatabankPaginationComponent implements OnInit {

  private maxPagesBeforeOrAfterCurrent: number = 3;

  // The threshold to check whether ellipsis is needed
  private ellipsisThreshold: number = 6;

  // If the total number of pages is less than this
  // threshold, display all pages
  private maxTotalPageWithoutEllipsis: number = 10;
  public pageSize = 10;

  /**
   * Sets the disabled status of the component, defaults to false
   */
  @Input() disabled: boolean = false;
  /**
   *
   */
  @Input() dontShowLast: boolean = true;
  /**
   * Shows the current page number
   */
  @Input() currentPage: number;
  /**
   * Shows the number of total pages
   */
  @Input() totalPages: number;
  /**
   * Event emitted when current page is changed
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  public ngOnInit () {
    this.pageChange.emit(this.currentPage);
  }

  consecutivePageRange() {
    let start = 2;
    let end = this.totalPages - 1;
    // If total number of pages less than or equal to 10,
    // then display all page links
    // Otherwise, use the algorithm to calculate the
    // start and end page to show between the first and
    // last page
    if (this.totalPages > this.maxTotalPageWithoutEllipsis) {
      // If the current page is less than the threshold,
      // then display first 8 page links followed by
      // ellipsis and the last page link
      if (this.currentPage < this.ellipsisThreshold) {
        end = start + this.ellipsisThreshold;
      } else if (this.currentPage >
        this.totalPages - this.ellipsisThreshold) {
        // Else if the current page is greater than the
        // total page minus threshold, then display the
        // first page link followed by ellipsis and the
        // last 8 page links
        start = end - this.ellipsisThreshold;
      } else {
        // For all other conditions, display the first
        // page link followed by ellipsis and three
        // links before and after the current page
        // followed by ellipsis and the last page link
        start = this.currentPage
          - this.maxPagesBeforeOrAfterCurrent;
        end = this.currentPage
          + this.maxPagesBeforeOrAfterCurrent;
      }
    }

    const ret = [];
    for (let i = start; i <= end; i++) {
      ret.push(i);
    }
    return ret;
  }

  onPageClick(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageChange.emit(this.currentPage);
  }

  onNextClick() {
    this.onPageClick(this.currentPage + 1);
  }

  onPreviousClick() {
    this.onPageClick(this.currentPage - 1);
  }

  showPrevious() {
    return this.currentPage > 1;
  }

  showNext() {
    return this.currentPage < this.totalPages;
  }

  showLastButton() {
    return this.totalPages > 1;
  }

  showLastEllipsis() {
    return (this.totalPages
      > this.maxTotalPageWithoutEllipsis)
      && (this.currentPage
        <= this.totalPages - this.ellipsisThreshold);
  }

  showFirstEllipsis() {
    return (this.totalPages
      > this.maxTotalPageWithoutEllipsis)
      && (this.currentPage >= this.ellipsisThreshold);
  }

  textDecoration(i) {
    return this.currentPage === i ? 'active' : '';
  }

  getAriaLabel(i) {
    return this.currentPage === i ? 'current' : '';
  }
}
