import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "results",
  templateUrl: "results.template.html",
  standalone: false,
})
export class ResultsTemplateComponent {
  /**
   * Total number of results, value passed to generate list results
   * message and pagination
   */
  @Input() public totalElements: number;
  /**
   * Current page number, value passed to generate list results message
   * and pagination
   */
  @Input() public currentPage: number;

  /**
   * Total number of pages, value passed to generate list results message
   * and pagination
   */
  @Input() public totalPages: number;

  /**
   * Total number of resuls shown per page
   */
  @Input() public showing: number;

  /**
   * Text that immediately follows "Showing 21-30 of..."
   */
  @Input() public listMessageSuffix: string;

  /**
   * Event emitter when user navigates to a different page
   */
  @Output() public pageChange: EventEmitter<number> =
    new EventEmitter<number>();

  pageChangeHandler(event: number): void {
    this.pageChange.emit(event);
  }
}
