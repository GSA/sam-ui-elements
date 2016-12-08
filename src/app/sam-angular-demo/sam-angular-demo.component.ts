import { Component } from '@angular/core';
 

@Component({
  selector: 'swds',
  templateUrl: 'sam-angular-demo.template.html'
})
export class SamAngularDemo {

  // Button Component
  btnType: string = "default";

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

  // Radio Component
  radioModel: any = 'ma';
  radioConfig = {
    options: [
      {value: 'dc', label: 'DC', name: 'radio-dc'},
      {value: 'ma', label: 'Maryland', name: 'radio-maryland'},
      {value: 'va', label: 'Virginia', name: 'radio-virginia'},
    ],
    name: 'radio-component',
    label: 'Select a region',
    errorMessage: '',
    hint: ''
  };

  // Checkboxes Component
  checkboxModel: any = ['ma'];
  checkboxConfig = {
    options: [
      {value: 'dc', label: 'DC', name: 'checkbox-dc'},
      {value: 'ma', label: 'Maryland', name: 'checkbox-maryland'},
      {value: 'va', label: 'Virginia', name: 'checkbox-virginia'},
    ],
    name: 'my-sr-name',
    label: 'Select a region',
  };

  // Pagination Component
  paginationConfig = {
    currentPage: 1,
    totalPages: 1
  };

  // Name Component
  nameModel = {
    title: "Mr.",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    suffix: "Sr."
  };

  // Phone Entry Component
  phoneModel = "";


  constructor() {
  }


  onEmptyOptionChanged($event) {
    if ($event.target.checked) {
      this.selectConfig.options.unshift({label: '', value: '', name: 'empty-option'});
    } else {
      this.selectConfig.options.shift();
    }
  }

  /**
   * Example to change button type when click
   */
  onDefaultBtnClick(){
    if(this.btnType === "default"){
      this.btnType = "alt";
    }else if(this.btnType === "alt"){
      this.btnType = "secondary";
    }else{
      this.btnType = "default";
    }
  }

  phoneModelChange(phoneNum){
    this.phoneModel = phoneNum;
  }
}
