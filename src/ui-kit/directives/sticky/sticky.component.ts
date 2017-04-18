import { HostListener, Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

/**
 * The sam-sticky directive is made to help nav bar stick on the page
 */
@Directive({ selector: '[sam-sticky]' })
export class SamStickyComponent implements OnInit {

  // Research sticky polyfill
  // http://html5please.com/#sticky
  /**
  * Sets the minimum pixel width for sticky to trigger on.
  */
  @Input() limit: number = 0;
  /**
  * Sets the container target class
  */
  @Input() container: string;

  // Make a nav bar sticky when the diff between nav bar and its container is larger than diffLimit
  private diffLimit:number = 100;
  // Set the nav bar top position when fixed
  private stickyTop:number = 10;
  // Get the initial width of the element
  private elemWidth:number;

  @HostListener('window:resize', ['$event'])
  resize(event) {
    // Set element to initial styles
    // to help finding the initial element width
    this.renderer.setElementStyle(this.el.nativeElement, 'position', "static");
    this.renderer.setElementStyle(this.el.nativeElement, 'width', "auto");

    this.elemWidth = this.el.nativeElement.offsetWidth;
    this.makeSticky();
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event) {
    this.makeSticky();
  }

  constructor( private el: ElementRef, private renderer: Renderer) {}

  ngOnInit(){
    this.elemWidth = this.el.nativeElement.offsetWidth;
  }

  makeSticky(){
    if(window.innerWidth <= this.limit){
      this.setPosition("static");
      this.renderer.setElementStyle(this.el.nativeElement, 'width', "auto");
      this.renderer.setElementStyle(this.el.nativeElement, 'top', "auto");
    }else {
      this.adjustStickyPos();
    }
  }

  setPosition(position: string){
    this.renderer.setElementStyle(this.el.nativeElement, 'position', position);
  }

  getDocHeight() {
    let D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  getScrollTop(){
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
  }

  /**
   * Get the distance from the element to the top of the document
   */
  getElemDistanceToTop(elem){
    var distance = 0;
    if (elem.offsetParent) {
      do {
        distance += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return distance;
  }

  isTallestAmongSiblings():boolean{
    let highest = true;
    let parentContainer: any = document.getElementsByClassName(this.container);
    let directChild = this.findDirectChild();
    let height = directChild.offsetHeight;

    for(var i = 0; i < parentContainer[0].children.length; i++) {
      if(directChild !== parentContainer[0].children[i] && parentContainer[0].children[i].offsetHeight > height) {
        highest = false;
      }
    }
    return highest;
  }

  findDirectChild(){
    let parentContainer: any = document.getElementsByClassName(this.container);
    let directChild;
    let curNode = this.el.nativeElement;
    if (curNode.parentNode) {
      do {
        if(curNode.parentNode === parentContainer[0]){
          directChild = curNode;
          break;
        }
        curNode = curNode.parentNode;
      } while (curNode);
    }
    return directChild;
  }

  adjustStickyPos(){
    if(this.isTallestAmongSiblings()){
      this.setPosition("static");
      return;
    }

    let parentContainer: any = document.getElementsByClassName(this.container);
    let documentHeight = this.getDocHeight();
    let scrollPosition = this.getScrollTop() + window.innerHeight;
    let parentContainerLimit = parentContainer[0].offsetHeight + parentContainer[0].offsetTop;
    let restOfDocumentHeight = documentHeight - parentContainerLimit;
    let stickyElementLimit = this.el.nativeElement.offsetTop + this.el.nativeElement.offsetHeight;
    let stickyElementTopMargin = 20 + (this.el.nativeElement.offsetTop * -1);
    let stopLimit = (documentHeight - restOfDocumentHeight) + ( window.innerHeight - stickyElementLimit);
    let parentContainerToTop = this.getElemDistanceToTop(parentContainer[0]);

    
    // Start to make it sticky when:
    // 1.the element is scrolled to top
    // 2.the container's height is larger than the element height plus diffLimit

    if(this.getScrollTop() + this.stickyTop > parentContainerToTop+ this.el.nativeElement.offsetTop
      && this.el.nativeElement.offsetHeight + this.diffLimit < parentContainer[0].offsetHeight){
      this.setPosition("fixed");
      // Make the elem stick on top until the space is not enough to show the elem
      if (this.el.nativeElement.offsetHeight+this.getScrollTop()< parentContainerToTop+parentContainer[0].offsetHeight-50) {
        this.renderer.setElementStyle(this.el.nativeElement, 'top', this.stickyTop + "px");
      }else  {
        let topPosition = (stickyElementTopMargin + (scrollPosition - stopLimit)) * -1;
        this.renderer.setElementStyle(this.el.nativeElement, 'top', topPosition + "px");
      }
      this.renderer.setElementStyle(this.el.nativeElement, 'width', this.elemWidth+"px");
    }else{
      this.setPosition("static");
    }
  }

}
