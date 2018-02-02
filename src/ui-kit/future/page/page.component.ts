import { Component, Input, HostListener} from '@angular/core';
import {SamPageService } from './page.service';

@Component({
  selector: "sam-page",
  templateUrl: 'page.template.html',
  providers: [SamPageService]
})
export class SamPageComponent{

  @Input() public suptitle: any;
  @Input() public title: any;
  @Input() public subtitle: any;
  @Input() public breadcrumbs: any;

  @HostListener('click', ['$event']) onClicked($event){
    $event.stopPropagation();
  }
  constructor(private pageService: SamPageService){}

}