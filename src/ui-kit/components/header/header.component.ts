import { Component, Output, EventEmitter } from "@angular/core";

/**
 * The <sam-header> component contains navigational links to main sections of
 * the site
 */
@Component({
  selector: "sam-header",
  templateUrl: "header.template.html",
  standalone: false,
})
export class SamHeaderComponent {
  /**
   * Emitted event from child dropdown component
   */
  @Output() headerDropdownControl: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  dropdownEventControl(value: boolean) {
    this.headerDropdownControl.emit(value);
  }
  // deprecated
  refreshPage() {
    window.location.reload();
  }
}
