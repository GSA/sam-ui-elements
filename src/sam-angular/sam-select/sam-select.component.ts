import { Component, Input } from '@angular/core';

@Component({
  selector: 'samSelect2',
  templateUrl: 'sam-select.template.html'
})
export class SamSelectComponent {
  @Input() config: any;
  @Input() value: any;

  public hasError: boolean;

  constructor() {

  }
}
