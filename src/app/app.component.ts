/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentInjectService } from './common/service/component.inject.service.ts';
import { InputTypeConstants } from './common/constants/input.type.constants.ts';
import '../assets/js/samuikit.js';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  templateUrl: './app.template.html',
  providers : [ComponentInjectService,InputTypeConstants]
})
export class App {
  testValue = { value: 'Test' };
  buttonValue: any = {type:"default", data:"Default"};
  labelValue: any = {type:"small", data:"Day"};
  accordionsValue: any = {accordions: [
                                          {title:"Test1", content:"This is Test1",expanded:false},
                                          {title:"Test2", content:"This is Test2", expanded:true},
                                          {title:"Test3", content:"This is Test3",expanded:false}
                                        ],
                          bordered:false};
  selectValue: any = {
                                type: 'dropdown',
                                label: 'Dropdown label',
                                name: 'options',
                                options: {
                                  'value1': 'Option A',
                                  'value2': 'Option B',
                                  'value3': 'Option C'
                                }
                              };
  labelName: string = "button";
  constructor() {

  }

  ngOnInit() {

  }

  clicked(){
    console.log("****This is test*****");
  }

}
