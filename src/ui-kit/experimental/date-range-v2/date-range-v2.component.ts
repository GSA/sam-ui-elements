import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sam-date-range-v2',
  templateUrl: './date-range-v2.component.html',
  styleUrls: ['./date-range-v2.component.scss']
})
export class SamDateRangeV2Component implements OnInit {
  example1;
  example2 = '12/12/2017';
  example3;
  example4;
  picker;
  resultPicker2;
  date;
  constructor() { }

  ngOnInit() {
  }

}
