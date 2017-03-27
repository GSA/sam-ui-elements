import { Component, Input, OnChanges } from '@angular/core';

/**
 * Sam Collapsible Component
 * This component behaves similar to the accordion. However, a collapsible
 * should contain actions rather than content.
 */
@Component({
  selector: 'sam-collapsible',
  templateUrl: 'collapsible.template.html'
})
export class SamCollapsibleComponent implements OnChanges {
  /**
   * The label input is the name of the collapsible section header that will be visible to the user
   */
  @Input() public label: string;

  /**
   * The startOpened input intializes the component in the open state if set to true
   * Otherwise, the component defaults to closed.
   */
  @Input() public startOpened: boolean;

  private _isOpened: boolean = false;

  constructor() {}

  ngOnChanges(): void {
    this._isOpened = this.startOpened || false;
  }

  isFilterOpen(): boolean {
    return this._isOpened;
  }

  toggleFilter(): boolean {
    return this._isOpened = !this._isOpened;
  }

  toggleButtonLabel(): string {
    return this.isFilterOpen() ? 'fa fa-minus' : 'fa fa-plus';
  }
}