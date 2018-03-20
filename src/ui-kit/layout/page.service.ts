import { Injectable } from '@angular/core';

@Injectable()
export class PageService {
  _sidebar: boolean;
  _wideSidebar: boolean;
  sidebarColumns: string;
  mainContentColumns: string;

  set sidebar(value: boolean) {
    this._sidebar = value;
    if (this._sidebar && !this.wideSidebar) {
      this.sidebarColumns = '3';
      this.mainContentColumns = '9';
    } else if (this._sidebar && this.wideSidebar) {
      this.sidebarColumns = '4';
      this.mainContentColumns = '8';
    } else {
      this.sidebarColumns = '';
      this.mainContentColumns = '12';
    }
  }

  get sidebar() {
    return this._sidebar;
  }

  set wideSidebar(value: boolean) {
    this._wideSidebar = value;
    if (this.wideSidebar && this.sidebar) {
      this.sidebarColumns = '4';
      this.mainContentColumns = '8';
    }
  }

  get wideSidebar() {
    return this._wideSidebar;
  }
}
