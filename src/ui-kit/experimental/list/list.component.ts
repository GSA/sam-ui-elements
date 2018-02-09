import { Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, state, transition, query, style, stagger, animate} from "@angular/animations";

@Component({
  selector: "sam-list",
  animations: [
    trigger('listAnimation', [
      state('void', style({
        opacity: 0  
      })),
      state('*', style({
        opacity: 1  
      })),
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true}),
        query(':enter', stagger('100ms', [
          animate('1s', style({ opacity: 1 }))
        ]), { optional: true })
      ])
    ])
  ],
  template: `
  <ul class="sam-ui list-next" [ngClass]="orientation">
    <li *ngFor="let item of items">
      <a *ngIf="item.link; else isNotLink">
        <sam-icon *ngIf="item.icon" [name]="item.icon"></sam-icon>
        {{ item.text }}
      </a>
      <ng-template #isNotLink>
        <sam-icon *ngIf="item.icon" [name]="item.icon"></sam-icon>
        {{ item.text }}
      </ng-template>
    </li>
  </ul> 
  `
})
export class SamListComponent {
  
  @Input() public items: any;
  @Input() public orientation: string;
  
  constructor(){}
  
}