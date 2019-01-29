import { Component, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'samSideNavigationToolbarItem',
  templateUrl: './sideNavigationToolbarItem.component.html',
  styleUrls: ['./sideNavigationToolbarItem.component.scss']
})
export class SamSideNavigationToolbarItemComponent {
  // @Input()
  // public samSideNavigationToolbarItems: SamSideNavigationToolbarItem[] = [
  //   { 'title': 'Title 1', 'icon': 'icon 1', 'templateName': 'section1' },
  //   { 'title': 'Title 2', 'icon': 'icon 2', 'templateName': 'section2' },
  //   { 'title': 'Title 3', 'icon': 'icon 3', 'templateName': 'section3' },
  //   { 'title': 'Title 4', 'icon': 'icon 4', 'templateName': 'section4' }
  // ];

  @Input()
  public title: string;

  @Input()
  public icon: string;

  /**
* Event emitted when level change is clicked
*/
  @Output() public sideNavigationToolbarItemSelected = new EventEmitter<SamSideNavigationToolbarItemComponent>();

  selected(){
    this.sideNavigationToolbarItemSelected.emit(this);
  }

}
// export class SamSideNavigationToolbarItem {
//   public title: string;
//   public icon: string;
//   public templateName: string;

// }
