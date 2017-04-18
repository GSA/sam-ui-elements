import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sam-info-accordion',
  templateUrl: 'info-accordion.template.html'
})
export class SamInfoAccordionComponent {

  @Input() name:string;
  @Input() data:any;
  @Input() showDetailTitle:boolean = true;
  @Input() isExternalLink:boolean = true;
  @Input() hasLayer:boolean = true;
  @Input() isReleaseDetail:boolean = false;
  @Input() closeNotification:string = "";
  @Output() updateNotification:EventEmitter<any> = new EventEmitter<any>();

  detailObj: any = {
    showDetail: false,
    posX: -1,
    posY: -1,
    item: {}
  };

  formatted: boolean = false;
  innerWidth: number = window.innerWidth;

  constructor() { }

  ngOnInit(){
    this.formatData();
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

      // Split the data to fit in 3 data item a row
      while (tempData.length > 0)
        formatData.push(tempData.splice(0, 3));

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
    }
    this.closeNotification = this.name;
    this.updateNotification.emit(this.closeNotification);
    event.stopPropagation();
  }

  private getItemClass(i, j){
    if(this.isCurrent(i,j) && this.detailObj.showDetail){
      return "fa-minus";
    }
    return "fa-plus";
  }

  private getTriClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
      return "tri-down";
    }
    return "no-tri-down";
  }

  private closeReferenceDetail(){
    this.detailObj.showDetail = false;
    this.detailObj.item = {};
  }

  private getLayerClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
      return "image-filter-layer-select";
    }
    return "image-filter-layer-unselect";
  }

  private getBorderClass(i, j): string{
    if(this.isCurrent(i ,j) && this.detailObj.showDetail){
      return "item-border-select";
    }
    return "item-border-unselect";
  }

  private largeScreen(): boolean{
    return this.innerWidth >= 1200;
  }

  private getImageContainerClass(): string{
    if(this.largeScreen()){
      return "images-container"
    }
    return "images-container-small"

  }

  private getLinkClass(): string{
    return this.isExternalLink? "usa-external_link":"";
  }

  private toggleDetail(i): boolean{
    return this.detailObj.showDetail && this.detailObj.posX === i;
  }

  private isCurrent(i,j):boolean{
    return i === this.detailObj.posX && j === this.detailObj.posY;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

}
