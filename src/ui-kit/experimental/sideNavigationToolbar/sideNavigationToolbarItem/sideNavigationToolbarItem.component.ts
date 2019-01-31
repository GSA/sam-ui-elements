import { Component, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sam-side-navigation-toolbar-item',
  templateUrl: './sideNavigationToolbarItem.component.html',
  styleUrls: ['./sideNavigationToolbarItem.component.scss']
})
export class SamSideNavigationToolbarItemComponent {

  @Input()
  public title: string;

  @Input()
  public icon: string;

  public showSection: boolean = false;

  @Output() public sideNavigationToolbarItemSelected = new EventEmitter<SamSideNavigationToolbarItemComponent>();

  open() {
    if (this.showSection) {
      this.showSection = false;
    } else {
      this.sideNavigationToolbarItemSelected.emit(this);
    }
  }

  close() {
    this.showSection = false;
  }
}
