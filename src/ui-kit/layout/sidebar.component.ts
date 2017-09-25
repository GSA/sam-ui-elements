import { Component, Input, OnInit } from '@angular/core';
import { PageService } from './page.service'

@Component({
  selector: 'sidebar',
  template: '<ng-content></ng-content>',
})
export class SidebarTemplateComponent implements OnInit{
  
  @Input() public wide: boolean = false;
  
  constructor(private pageService: PageService) {
  }
  
  ngOnInit(): void{
    this.pageService.sidebar = true;
    this.pageService.wideSidebar = this.wide;
  }
  
}