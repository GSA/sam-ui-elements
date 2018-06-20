import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  Input
} from '@angular/core';
import { MdSidenav } from './sidenav/sidenav';

@Component({
    selector: 'sam-toolbar',
    template: `
  <div class="sam small menu">
    <a (click)="sidenav.toggle()">
      Toggle filters
    </a>
    <div class="section right">
      <a>
        <i class="fa fa-download" aria-hidden="true"></i>
        Download
      </a>
      <a>
        <i class="fa fa-share-alt" aria-hidden="true"></i>
        Share
      </a>
      <a>
        <i class="fa fa-cloud" aria-hidden="true"></i>
        Save Criteria
      </a>
    </div>
  </div>
  `
  })
  export class SamToolbarComponent {
    @Input() sidenav: MdSidenav;
  }
