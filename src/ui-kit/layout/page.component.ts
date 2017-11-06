import { Component, Input,  Output, EventEmitter, OnInit } from '@angular/core';
import { PageService } from './page.service';
import { PageConfig } from './types';

@Component({
  selector: 'page',
  templateUrl: 'page.template.html',
  providers: [PageService],
})
export class PageTemplateComponent implements OnInit{

  @Input() public breadcrumbs: any;
  @Input() public theme: string;
  @Input() public section: any;
  @Input() public title: any;
  @Input() public badge: string;
  @Input() public type: string;
  @Input() public typeLabel: string;
  @Input() public caption: string;

  @Input() public options: PageConfig = {
    badge: null
  };

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
