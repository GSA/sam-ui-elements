import { Component, EventEmitter, HostListener, Renderer2} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SamMasterPageService } from './master-page.service';

@Component({
  selector: "sam-master-page",
  templateUrl: 'master-page.template.html',
  providers: [SamMasterPageService]
})
export class SamMasterPageComponent{

  @HostListener('click', ['$event']) onClick($event){
    if($event.target.localName == 'ng-component'){
      this.router.navigate([{ outlets: { 'master-modal': null } }], {relativeTo:this.route});
    }
  }

  modalOutletName: string = 'master-modal';
  
  constructor(
    private masterpageservice: SamMasterPageService,
    private router: Router, 
    private route: ActivatedRoute, 
    private renderer: Renderer2){
    router.events.subscribe((evt) => {
      if(evt instanceof NavigationEnd){
        let activeOutlets = this.findActiveOutlets(route.children);
        let modalOutletFound = this.modalActive(activeOutlets);
        if(modalOutletFound){
          this.renderer.addClass(document.body, 'modal-open');
        } else {
          this.renderer.removeClass(document.body, 'modal-open');
        }
      }
    });
  }

  findActiveOutlets(activatedRoutes){
    let activeOutlets: string[] = [];
    for(let activeRoute of activatedRoutes){
      activeOutlets.push(activeRoute.outlet);
    }
    return activeOutlets;
  }

  modalActive(activeOutlets){
    return true ? activeOutlets.indexOf(this.modalOutletName) > -1 : false;
  }

}