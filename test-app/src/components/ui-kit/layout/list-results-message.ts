import { Component, Input, OnChanges  } from '@angular/core';

/**
* ListResultsMessageComponent - Lists results message component
*/
@Component({
  selector: 'list-results-message',
  template: '{{ message }}'
})
export class ListResultsMessageComponent implements OnChanges {
  @Input() public total: number;
  @Input() public currentPage: number;
  @Input() public showing: number;
  @Input() public suffix: string;
  message: string;

  ngOnChanges() {
    const total = this.total;
    let currentPage = this.currentPage;
    let showing = this.showing;

    if (total < showing) {
      currentPage = 1;
      showing = total;
    }

    let numberA = (currentPage - 1) * showing;
    let numberB = numberA + showing;
    numberA += 1;

    if (numberB > total) {
      numberB = total;
    }

    this.message = 'Showing ' 
      + numberA.toLocaleString()
      + ' - '
      + numberB.toLocaleString()
      + ' of '
      + total.toLocaleString();

    if (this.suffix) {
      this.message += ' ' + this.suffix;
    } else {
      this.message += ' results';
    }
  }
}
