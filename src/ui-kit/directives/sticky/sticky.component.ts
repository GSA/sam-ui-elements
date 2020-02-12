import {
  HostListener,
  Directive,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';

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

  // Make a nav bar sticky when the diff between nav bar and its container is 
  // larger than diffLimit
  private diffLimit: number = 100;
  // Set the nav bar top position when fixed
  private stickyTop: number = 10;
  // Get the initial width of the element
  private elemWidth: number;

  @HostListener('window:resize', ['$event'])
  resize(event) {
    // Set element to initial styles
    // to help finding the initial element width
    this.el.nativeElement.style.position = 'static';
    this.el.nativeElement.style.width = 'auto';

    this.elemWidth = this.el.nativeElement.offsetWidth;
    this.makeSticky();
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event) {
    this.makeSticky();
  }

  constructor( private el: ElementRef) {}

  ngOnInit() {
    if (this.el.nativeElement.offsetWidth !== this.elemWidth) {
      this.elemWidth = this.el.nativeElement.offsetWidth;
    }
  }

  ngAfterViewChecked() {
    if (this.el.nativeElement.offsetWidth !== this.elemWidth) {
      this.elemWidth = this.el.nativeElement.offsetWidth;
    }
  }

  makeSticky() {
    if (window.innerWidth <= this.limit) {
      this.setPosition('static');
      this.el.nativeElement.style.width = 'auto';
      this.el.nativeElement.style.top = 'auto';
    } else {
      this.adjustStickyPos();
    }
  }

  setPosition(position: string) {
    this.el.nativeElement.style.position = position;
  }

  getDocHeight() {
    const D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  getScrollTop() {
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
  }

  /**
   * Get the distance from the element to the top of the document
   */
  getElemDistanceToTop(elem) {
    let distance = 0;
    let el = elem;
    if (el.offsetParent) {
      do {
        distance += el.offsetTop;
        el = el.offsetParent;
      } while (el);
    }
    return distance;
  }

  isTallestAmongSiblings(): boolean {
    let highest = true;
    const parentContainer: any =
      document.getElementsByClassName(this.container);
    const directChild = this.findDirectChild();
    const height = directChild.offsetHeight;

    for (let i = 0; i < parentContainer[0].children.length; i++) {
      if (directChild !== parentContainer[0].children[i]
        && parentContainer[0].children[i].offsetHeight > height) {
        highest = false;
      }
    }
    return highest;
  }

  findDirectChild() {
    const parentContainer: any =
      document.getElementsByClassName(this.container);
    let directChild;
    let curNode = this.el.nativeElement;
    if (curNode.parentNode) {
      do {
        if (curNode.parentNode === parentContainer[0]) {
          directChild = curNode;
          break;
        }
        curNode = curNode.parentNode;
      } while (curNode);
    }
    return directChild;
  }

  adjustStickyPos() {
    if (this.isTallestAmongSiblings()) {
      this.setPosition('static');
      return;
    }
    const defaultTopMargin = 20;
    const defaultOffset = 50;
    const parentContainer: any =
      document.getElementsByClassName(this.container);
    const documentHeight = this.getDocHeight();
    const scrollPosition = this.getScrollTop() + window.innerHeight;
    const parentContainerLimit =
      parentContainer[0].offsetHeight + parentContainer[0].offsetTop;
    const restOfDocumentHeight = documentHeight - parentContainerLimit;
    const stickyElementLimit =
      this.el.nativeElement.offsetTop + this.el.nativeElement.offsetHeight;
    const stickyElementTopMargin =
      defaultTopMargin + (this.el.nativeElement.offsetTop * -1);
    const stopLimit =
      (documentHeight - restOfDocumentHeight)
      + ( window.innerHeight - stickyElementLimit);
    const parentContainerToTop = this.getElemDistanceToTop(parentContainer[0]);

    
    // Start to make it sticky when:
    // 1.the element is scrolled to top
    // 2.the container's height is larger than the element height plus diffLimit
    if ((this.getScrollTop() !== 0)
      && this.getScrollTop() + this.stickyTop
        > parentContainerToTop + this.el.nativeElement.offsetTop
      && this.el.nativeElement.offsetHeight + this.diffLimit
        < parentContainer[0].offsetHeight) {
      this.setPosition('fixed');
      // Make the elem stick on top until the space is not enough to show the
      // elem
      if (this.el.nativeElement.offsetHeight + this.getScrollTop()
        < parentContainerToTop + parentContainer[0].offsetHeight
          - defaultOffset) {
        this.el.nativeElement.style.top = this.stickyTop + 'px';
      } else {
        const topPosition =
          (stickyElementTopMargin + (scrollPosition - stopLimit)) * -1;
        this.el.nativeElement.style.top = topPosition + 'px';
      }
      this.el.nativeElement.style.width = this.elemWidth + 'px';
    } else {
      this.setPosition('static');
    }
  }
}
