import { Component, Input,  Output, EventEmitter, OnInit } from '@angular/core';
import { PageService } from './page.service'

@Component({
  selector: 'page',
  templateUrl: 'page.template.html',
})
export class PageTemplateComponent implements OnInit{
  
  @Input() public breadcrumbs: any;
  @Input() public theme: string;
  @Input() public section: any;
  @Input() public title: any;
  
  @Output() public breadcrumbOut = new EventEmitter();
  
  constructor(private pageService: PageService){}
  
  ngOnInit(): void{
    // Reset sidebar
    this.pageService.sidebar = false;
    this.pageService.wideSidebar = false;
  }
  
  breadcrumbHandler(evt){
    this.breadcrumbOut.emit(evt);
  }
  
}