import { Component, Output, EventEmitter} from '@angular/core';

/**
 * The <sam-banner> component informs the user that the site is an official
 * website of the United States Government
 */
@Component({
  selector: 'sam-banner',
  templateUrl: 'banner.template.html',
})
export class SamBannerComponent {
  showDetail: boolean = false;

  toggleDetails() {
    this.showDetail = !this.showDetail;
  }
}
