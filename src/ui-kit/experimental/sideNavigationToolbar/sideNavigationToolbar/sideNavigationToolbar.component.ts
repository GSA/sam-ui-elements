import { Component, Input, TemplateRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { SamSideNavigationToolbarItemComponent } from '../sideNavigationToolbarItem/sideNavigationToolbarItem.component';

@Component({
  selector: 'sam-side-navigation-toolbar',
  templateUrl: './sideNavigationToolbar.component.html',
  styleUrls: ['./sideNavigationToolbar.component.scss']
})
export class SamSideNavigationToolbarComponent {

  /**
   * Containter of all the children of type SamSideNavigationToolbarItemComponent
   */
  @ContentChildren(SamSideNavigationToolbarItemComponent) items: QueryList<SamSideNavigationToolbarItemComponent>;


  ngAfterContentInit() {
    this.items.toArray().forEach((menuItem: SamSideNavigationToolbarItemComponent) => {
      menuItem.sideNavigationToolbarItemSelected.subscribe((item) => this.selectedItem(item));
    });
  }

  /**
   * When Item is selected it closes all other sections
   * @param item 
   */
  selectedItem(item: SamSideNavigationToolbarItemComponent) {
    this.items.toArray().forEach((menuItem: SamSideNavigationToolbarItemComponent) => {
      menuItem.showSection = item === menuItem
    });
  }
}

