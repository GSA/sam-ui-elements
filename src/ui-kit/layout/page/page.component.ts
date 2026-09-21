import { Component, Input, Injectable, OnInit, inject } from "@angular/core";

@Injectable()
export class SamPageService {
  sidebar = false;
}

/**
 *
 */
@Component({
  selector: "sam-page",
  templateUrl: "page.template.html",
  providers: [SamPageService],
  standalone: false,
})
export class SamPageComponent {
  pageService = inject(SamPageService);

  /**
   * Sets the page header for the page
   */
  @Input() public title: string;

  /**
   * Sets an introduction to the page
   */
  @Input() public intro: string;
}

/**
 *
 */
@Component({
  selector: "sam-page-sidebar",
  template: `
    <div class="page-sidebar">
      <ng-content></ng-content>
    </div>
  `,
  standalone: false,
})
export class SamPageSidebarComponent implements OnInit {
  private pageService = inject(SamPageService);

  ngOnInit() {
    this.pageService.sidebar = true;
  }
}
