import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

/**
 * The <samPOC> component outputs Point of Contact information
 *
 * @Input data: any - Populates the component with the provided data
 */
@Component({ selector: 'samPOC',
  templateUrl: 'point-of-contact.template.html'
})
export class SamPointOfContactComponent implements OnInit {
  
  @Input() data: any;

  constructor( ) {}

  ngOnInit(){
  }

}
