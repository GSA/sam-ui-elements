import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({ selector: 'samPOC',
  templateUrl: 'point-of-contact.template.html'
})
export class SamPointOfContactComponent implements OnInit {
  
  @Input() data: any;

  constructor( ) {}

  ngOnInit(){
  }

}
