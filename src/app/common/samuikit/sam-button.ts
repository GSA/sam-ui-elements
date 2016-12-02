import { Component, Input } from '@angular/core';
import { ComponentInjectService } from '../service/component.inject.service.ts';
import { InputTypeConstants } from '../constants/input.type.constants.ts';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector:'samButton',
  template:`<div id={{labelname}} [innerHTML]='html'></div>`,
  providers: [ComponentInjectService, InputTypeConstants]
})
export class SamButton{

  @Input() labelname: string;
  @Input() config: any;

  html: SafeHtml;

  constructor(
    private _componentInjectService : ComponentInjectService
  ) {
  }

  ngOnInit(){
    this.html = this._componentInjectService.renderComponentHTML('button', this.config);
  }
}