import { Component, EventEmitter, HostListener, Renderer2} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  animateChild
} from '@angular/animations';

import { SamMasterPageService } from './master-page.service';


// easeOutBack:
//cubic-bezier(0.175, 0.885, 0.32, 1.275)

// easeInBack:
//cubic-bezier(0.6, -0.28, 0.735, 0.045)

@Component({
  selector: "sam-master-page",
  templateUrl: 'master-page.template.html',
  animations: [
    trigger('drawerState', [
      state('close', style({
        display: 'none',
        overflow: 'hidden',
        height: '0'
      })),
      state('open', style({
        display: 'block',
        height: '*'
      })),
      transition('close => open', [
        query(':self',[
          animate('250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'),
        ]),
        query('@search', [
          animateChild()
        ])
      ]),
      transition('open => close', animate('200ms ease-out'))
    ]),
    trigger('search', [
      transition('* => *', [
        query('.search', style({ 
          opacity: 0,
          transform: 'translateY(2px)' 
        })),
        query('.search', [
          animate('300ms ease-in', style({
            opacity: 1,
            transform: 'translateY(0px)'
          }))
        ])
      ])
    ])
  ],
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

    // Opens and closes the drawer
    drawerState = "open";
    toggleDrawer() {
      this.drawerState = this.drawerState === 'open' ? 'close' : 'open';
    }

    // when drawer is open set search input focus
    searchInputFocus = false;
    searchFocus(event){

      console.group( "Done animating" );
      console.log( "From:", event.fromState );
      console.log( "To:", event.toState );
      console.log( "Actual State:", this.drawerState );
      console.groupEnd();

      this.searchInputFocus = event.toState === 'open' ? true : false;
    }

    selectedDomain(event){
      this.masterpageservice.selectedDomain = event;
    }
    
    get docLink(){
      return this.masterpageservice.docLink;
    }

    get settingsLink(){
      return this.masterpageservice.settingsLink;
    }
}