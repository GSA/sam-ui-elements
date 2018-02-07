import { Injectable } from '@angular/core';

@Injectable()
export class SamMasterPageService {
  
  _docLink: string;
  set docLink(value: string){
    this._docLink = value;
  }
  get docLink(){
    return this._docLink;
  }

  _settingsLink: string;
  set settingsLink(value: string){
    this._settingsLink = value;
  }
  get settingsLink(){
    return this._settingsLink;
  }

}