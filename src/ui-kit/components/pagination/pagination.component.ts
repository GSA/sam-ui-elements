import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <sam-pagination> allows users to select a page
 */
@Component({
  selector: 'sam-pagination',
  templateUrl: 'pagination.template.html',
})
export class SamPaginationComponent {

  private maxPagesBeforeOrAfterCurrent: number = 3;
  private ellipsisThreshold: number = 6; // The threshold to check whether ellipsis is needed
  private maxTotalPageWithoutEllipsis: number = 10; // If the total number of pages is less than this threshold, display all pages

  /**
  * Sets the disabled status of the component, defaults to false
  */
  @Input() disabled: boolean = false;
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


  consecutivePageRange() {

    var start = 2;
    var end = this.totalPages - 1;
    // If total number of pages less than or equal to 10, then display all page links
    // Otherwise, use the algorithm to calculate the start and end page to show between the first and last page
    if(this.totalPages > this.maxTotalPageWithoutEllipsis){
      // If the current page is less than the threshold, then display first 8 page links followed by ellipsis and the last page link
      if(this.currentPage < this.ellipsisThreshold){
        end = start + this.ellipsisThreshold;
      }
      // If the current page is greater than the total page minus threshold, then display the first page link followed by ellipsis and the last 8 page links
      else if(this.currentPage > this.totalPages - this.ellipsisThreshold){
        start = end - this.ellipsisThreshold;
      }
      // For all other conditions, display the first page link followed by ellipsis and three links before and after the current page followed by ellipsis and the last page link
      else{
        start = this.currentPage - this.maxPagesBeforeOrAfterCurrent;
        end = this.currentPage + this.maxPagesBeforeOrAfterCurrent;
      }
    }

    let ret = [];
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
    return this.totalPages > this.maxTotalPageWithoutEllipsis && this.currentPage <= this.totalPages - this.ellipsisThreshold;
  }

  showFirstEllipsis() {
    return this.totalPages > this.maxTotalPageWithoutEllipsis && this.currentPage >= this.ellipsisThreshold;

  }

  textDecoration(i) {
    return this.currentPage === i ? 'usa-current' : '';
  }

  getAriaLabel(i){
    return this.currentPage === i ? 'current page '+ this.currentPage : `Page ${i}`;
  }

}
