import {Component, Input} from '@angular/core';

@Component({
  selector: 'sam-card',
  standalone: false,
  templateUrl: './card.template.html'
})
export class SamCardComponent{
  @Input() raised: boolean;
}