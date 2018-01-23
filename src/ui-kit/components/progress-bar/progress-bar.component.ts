import { Component, Input } from '@angular/core';

@Component({
  selector: 'sam-progress-bar',
  template: '<progress [attr.value]="value" [attr.max]="max"></progress>',
  styles: [`
    progress[value] {
      -webkit-appearance: none;
      appearance: none;
      height: 18px;
      border: 1px solid black;
      padding: 1px;
      width: 100%;
    }

    progress[value]::-webkit-progress-bar {
      background-color: transparent;
    }
    
    progress[value]::-webkit-progress-value {
      background-color: dodgerblue;
      border-color: transparent;
    }
  `]
})
export class SamProgress {
  @Input() value: number = 0;
  @Input() max: number = 1;
}
