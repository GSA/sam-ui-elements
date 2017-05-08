import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

@Component({
  selector: 'sam-info-accordion',
  templateUrl: 'info-accordion.template.html',
  animations: [
    
    trigger('fadeInOut', [
      state('in', style({opacity: '1'})),
      state('out', style({opacity: '1'})),
      transition('in => out, out => in', [
        animate('.4s', keyframes([
          style({ opacity: '1', transform: 'translateY(0%)', offset: 0}),
          style({ opacity: '0', transform: 'translateY(-5%)', offset: 0.3}),
          style({ opacity: '1', transform: 'translateY(0%)', offset: 1.0})
        ]))
      ])
    ]),
    
    trigger('pointingInOut', [
      state('in', style({opacity: '1', position: 'relative', top: '20px'})),
      state('out', style({opacity: '1', position: 'relative', top: '20px'})),
      transition('* => *', [
        animate('0.03s 0.3s', keyframes([
          style({ opacity: '0', top: '10%', offset: 0}),
          style({ opacity: '1', top: '10%', offset: 1.0})
        ]))
      ])
    ]),
    
    trigger('slideInOut', [
      state('in', style({height: '*'})),
      transition('void => *', [
        style({
          transform: 'translateY(-20%)',
          overflow: 'hidden',
          opacity: '0',
          height: '0' 
        }),
        animate('.3s ease-in', style({
          transform: 'translateY(0%)',
          overflow: 'hidden',
          opacity: '1',
          height: '*'
        }))
      ]),
      transition('* => void', [
        style({
          overflow: 'hidden',
          opacity: '1',
          height: '*'
        }),
        animate('.3s ease-out', style({
          transform: 'translateY(-20%)',
          overflow: 'hidden',
          opacity: '0',
          height: '0' 
        }))
      ])
    ]),
    
    trigger('overState', [
      state('inactive', style({
        transform: 'translateY(0%) scale(1)',
      })),
      state('active', style({
        transform: 'translateY(0%) scale(1.02)',
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out')),
      transition('void => inactive', [
        style({
          transform: 'translateY(10%) scale(1)',
        }),
        animate('.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ]),
    ])
  ]
})
export class SamInfoAccordionComponent {

  @Input() name:string;
  
  defaultItemsPerRow = 3;
  @Input() itemsPerRow = [this.defaultItemsPerRow];
  
  @Input() spacing:string = ""; //options: "very relaxed" and "relaxed"
  
  @Input() data:any;
  @Input() showDetailTitle:boolean = true;
  @Input() isExternalLink:boolean = true;

  @Input() closeNotification:string = "";
  @Output() updateNotification:EventEmitter<any> = new EventEmitter<any>();

  detailObj: any = {
    showDetail: false,
    posX: -1,
    posY: -1,
    item: {}
  };

  formatted: boolean = false;

  fadeSegmentInOut: string = '';

  constructor() { }

  ngOnInit(){
    this.formatData();
  }
  
  over(item) {
    item.state = (item.state === 'active' ? 'inactive' : 'active');
  }

  ngOnChanges(){
    if(this.closeNotification !== this.name){
      this.closeReferenceDetail();
    }
  }

  formatData(){
    if(!this.formatted) {
      let formatData = [];
      let tempData = this.data.slice(0);
      let row = 0;
      
      while (tempData.length > 0){
        formatData.push(tempData.splice(0, this.itemsPerRow[row] || this.defaultItemsPerRow));
        row++;
      }

      this.data = formatData;
      this.formatted = true;
    }
  }

  selectDetail(i, j, event){
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      this.detailObj.showDetail = false;
    }else{
      this.detailObj.showDetail = true;
      this.detailObj.posX = i;
      this.detailObj.posY = j;
      this.detailObj.item = this.data[this.detailObj.posX][this.detailObj.posY];
      this.fadeSegmentInOut = this.fadeSegmentInOut === 'in' ? 'out' : 'in';
    }
    this.closeNotification = this.name;
    this.updateNotification.emit(this.closeNotification);
    event.stopPropagation();
  }

  private getItemClass(i,j){
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      return "fa-minus";
    }
    return "fa-plus";
  }

  private closeReferenceDetail(){
    this.detailObj.showDetail = false;
    this.detailObj.item = {};
  }

  private getActiveClass(i,j): string{
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      return "basic lightest blue";
    }
    return "inverted cool blue";
  }

  private getLinkClass(): boolean{
    return this.isExternalLink ? true : false;
  }
  
  private toggleDetail(i): boolean{
    return this.detailObj.showDetail && this.detailObj.posX === i;
  }

  private isCurrent(i,j):boolean{
    return i === this.detailObj.posX && j === this.detailObj.posY;
  }

}
