import { Component, Output, EventEmitter} from '@angular/core';

/**
 * The <samBanner> component informs the user that the site is an official website of the United States Government
 */
@Component({
  selector: 'samBanner',
  templateUrl: 'banner.template.html',
})
export class SamBannerComponent {
  showDetail:boolean = false;

  constructor() {}

  ngOnInit(){}

  toggleDetails(){
    this.showDetail = !this.showDetail;
  }
}
