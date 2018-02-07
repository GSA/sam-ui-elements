import { Injectable } from '@angular/core';

@Injectable()
export class SamPageService {
  _sidebar: boolean;
  set sidebar(value: boolean){
    this._sidebar = value;
  }
  get sidebar(){
    return this._sidebar;
  }
}