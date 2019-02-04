import { Component, Input, TemplateRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { SamSideNavigationToolbarItemComponent } from '../sideNavigationToolbarItem/sideNavigationToolbarItem.component';

@Component({
  selector: 'sam-side-navigation-toolbar',
  templateUrl: './sideNavigationToolbar.component.html',
  styleUrls: ['./sideNavigationToolbar.component.scss']
})
export class SamSideNavigationToolbarComponent {

  /**
   * 
   */
  @ContentChildren(SamSideNavigationToolbarItemComponent) items: QueryList<SamSideNavigationToolbarItemComponent>;


  ngAfterContentInit() {
    this.items.toArray().forEach((menuItem: SamSideNavigationToolbarItemComponent) => {
      menuItem.sideNavigationToolbarItemSelected.subscribe((item) => this.selectedItem(item));
    });
  }

  /**
   * 
   * @param item 
   */
  selectedItem(item: SamSideNavigationToolbarItemComponent) {
    this.items.toArray().forEach((menuItem: SamSideNavigationToolbarItemComponent) => {
      menuItem.showSection = item === menuItem
    });
  }
}

