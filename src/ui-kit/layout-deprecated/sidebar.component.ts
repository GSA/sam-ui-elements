import { Component, Input, OnInit, inject } from "@angular/core";
import { PageService } from "./page.service";

@Component({
  selector: "sidebar",
  template: "<ng-content></ng-content>",
  standalone: false,
})
export class SidebarTemplateComponent implements OnInit {
  private pageService = inject(PageService);

  /**
   * Toggles a wider sidebar in the page service
   */
  @Input() public wide: boolean = false;

  ngOnInit(): void {
    this.pageService.sidebar = true;
    this.pageService.wideSidebar = this.wide;
  }
}
