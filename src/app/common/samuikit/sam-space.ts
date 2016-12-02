import {Component, OnInit, Input} from '@angular/core';
import { ComponentInjectService } from '../service/component.inject.service.ts';
import { InputTypeConstants } from '../constants/input.type.constants.ts';

@Component({
  selector: 'samSpace',
  template:`<div id={{labelname}}></div>`,
  providers: [ComponentInjectService, InputTypeConstants]
})
export class SamSpace implements OnInit {

  @Input() labelname;

  html : string;

  constructor(
    private _componentInjectService : ComponentInjectService
  ) {

  }

  ngOnInit() {
    //this.html = this._componentInjectService.renderComponentHTML('space', {});
  }
}



