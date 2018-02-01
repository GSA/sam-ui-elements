import { Component, Input,  Output, EventEmitter, OnInit } from '@angular/core';
import { PageService } from './page.service';
import { PageConfig } from './types';

@Component({
  selector: 'page',
  templateUrl: 'page.template.html',
  providers: [PageService],
})
export class PageTemplateComponent implements OnInit {
  /**
   * Passes in the breadcrumb model
   */
  @Input() public breadcrumbs: any;
  /**
   * Sets a theme on the template
   */
  @Input() public theme: string;
  /**
   * Sets the TitleAndSectionComponent section input
   */
  @Input() public section: any;
  /**
   * Sets the TitleAndSectionComponent title input
   */
  @Input() public title: any;
  /**
   * Sets the TitleAndSectionComponent badge input
   */
  @Input() public badge: string;
  /**
   * Sets the TitleAndSectionComponent type input
   */
  @Input() public type: string;
  /**
   * Sets the TitleAndSectionComponent type label input
   */
  @Input() public typeLabel: string;
  /**
   * Sets the TitleAndSectionComponent caption input
   */
  @Input() public caption: string;
  /**
   * Sets the TitleAndSectionComponent badgeOptions input
   */
  @Input() public options: PageConfig = {
    badge: undefined
  };
  /**
   * (deprecated) Emits breadcrumb events
   */
  @Output() public breadcrumbOut = new EventEmitter();
  /**
   * Emits breadcrumb events
   */
  @Output() public breadcrumbChange = new EventEmitter();

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    // Reset sidebar
    this.pageService.sidebar = false;
    this.pageService.wideSidebar = false;
  }

  breadcrumbHandler(evt) {
    this.breadcrumbOut.emit(evt);
    this.breadcrumbChange.emit(evt);
  }
}
