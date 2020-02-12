import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sam-side-navigation-toolbar-item',
  templateUrl: './sideNavigationToolbarItem.component.html',
  styleUrls: ['./sideNavigationToolbarItem.component.scss']
})
export class SamSideNavigationToolbarItemComponent {

  /**
   * Text on the button for the menu item
   */
  @Input()
  public title: string;

  /**
   * css class used for the icon
   */
  @Input()
  public icon: string;

  /**
   * id the Butto
   */
  @Input()
  public id: string;

  /**
   * Section is visible 
   */
  public showSection: boolean = false;

  /**
   * Event of if the Section is opened
   */
  @Output() public sideNavigationToolbarItemSelected = new EventEmitter<SamSideNavigationToolbarItemComponent>();

  /**
   * Opens the Section
   */
  open() {
    this.sideNavigationToolbarItemSelected.emit(this);
  }

  /**
   * Closes the Section
   */
  close() {
    this.showSection = false;
  }
}
