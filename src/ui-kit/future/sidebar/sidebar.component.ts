import { Component, HostListener, OnInit} from '@angular/core';
import { SamPageService } from '../page';

@Component({
  selector: "sam-sidebar",
  template: '<ng-content></ng-content>'
})
export class SamSidebarComponent implements OnInit{
  constructor(private pageService: SamPageService){

  }
  ngOnInit(){
    this.pageService.sidebar = true;
  }
}