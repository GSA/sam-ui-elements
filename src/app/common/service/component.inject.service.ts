import { Component, Injectable } from '@angular/core';
import { InputTypeConstants } from '../constants/input.type.constants.ts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable()
export class ComponentInjectService {

    constructor(private _inputTypeConstants : InputTypeConstants, private _sanitizer : DomSanitizer) {

    }

    compileToComponent(selector,template) {
      @Component({
        selector,
        template
      })
      class ComponentInject {};
      return ComponentInject;
    }

    getType(id : string) {
      let type : any;

      if(id === 'label')
        type = this._inputTypeConstants.getConstants().label;
      else if (id === 'alert')
        type = this._inputTypeConstants.getConstants().alert;
      else if(id === 'footer')
        type = this._inputTypeConstants.getConstants().footer;
      else if(id === 'header')
        type = this._inputTypeConstants.getConstants().header;
      else if(id === 'button')
        type = this._inputTypeConstants.getConstants().button;
      else if(id === 'select')
        type = this._inputTypeConstants.getConstants().select;
      else if(id === 'accordions')
        type = this._inputTypeConstants.getConstants().accordions;
      return type;
    }

    renderComponentHTML(id : string, config : any) : SafeHtml {
      let type = this.getType(id);
      let bypass = this._sanitizer.bypassSecurityTrustHtml;
      return bypass(type.render(config));
    }

    injectComponent( id : string, config : any){
      let type = this.getType(id);
      if(id ==='space')
        return this.compileToComponent(id,'<div></div>');
      return this.compileToComponent(id,type.render(config));
    }


}
