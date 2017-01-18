import { Component, Output, EventEmitter} from '@angular/core';

/**
 * The <samBanner> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Output onClose: output false when the close button on banner has been clicked.
 */
@Component({
  selector: 'samBanner',
  templateUrl: 'banner.template.html',
})
export class SamBannerComponent {

  showDetail:boolean = false;

  constructor() {
  }

  ngOnInit(){

  }

  toggleDetails(){
    this.showDetail = !this.showDetail;
  }



}
