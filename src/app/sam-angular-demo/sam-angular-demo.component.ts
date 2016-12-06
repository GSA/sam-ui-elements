import { Component } from '@angular/core';
 

@Component({
  selector: 'swds',
  templateUrl: 'sam-angular-demo.template.html'
})
export class SamAngularDemo {

  // Select Component
  selectModel = '';
  selectConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
      {value: 'dc', label: 'Washington DC', name: 'dc'},
      {value: 'ma', label: 'Maryland', name: 'maryland'},
      {value: 'va', label: 'Virginia', name: 'virginia'},
    ],
    disabled: false,
    label: 'region',
    name: 'region',
  };

  // Accordions Component
  accordionsData =
      [
        {title:"Test1", content:"This is Test1"},
        {title:"Test2", content:"This is Test2"},
        {title:"Test3", content:"This is Test3"}
      ];

  constructor() {
  }


  onEmptyOptionChanged($event) {
    if ($event.target.checked) {
      this.selectConfig.options.unshift({label: '', value: '', name: 'empty-option'});
    } else {
      this.selectConfig.options.shift();
    }
  }
}
