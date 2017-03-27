import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

/**
 * The <samPOC> component outputs Point of Contact information
 */
@Component({ selector: 'samPOC',
  templateUrl: 'point-of-contact.template.html'
})
export class SamPointOfContactComponent implements OnInit {
  /**
  * Populates the component with the provided data
  */
  @Input() data: any;

  constructor( ) {}

  ngOnInit(){
  }

}
