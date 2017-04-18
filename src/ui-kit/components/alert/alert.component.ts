import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * The <samAlert> component keeps users informed of important and sometimes time-sensitive changes
 */
@Component({
  selector: 'samAlert',
  templateUrl: './alert.template.html'
})
export class SamAlertComponent {
  /**
  * Set alert type, defaults to 'success'
  */
  @Input() type: string;
  /**
  * Set alert title
  */
  @Input() title: string;
  /**
  * Set alert title
  */
  @Input() class: string = "";
  /**
  * Set alert description
  */
  @Input() description: string;
  /**
  * Control whether to display/hide the Close button
  */
  @Input() showClose: boolean = false;
  /**
  * Assign a timeout to dismiss the alert
  */
  @Input() dismissTimer: number = 0;
  /**
  * Element to position alert against (Either native HTMLElement/selector/ElementRef)
  */
  @Input() target: any;
  /**
  * Position against element '<vertical> <horizontal>' or '<horizontal> <vertical>' [top|right|bottom|center]
  */
  @Input() placement: string;
  /**
  * Any additional { top: 0, left: 0 } offsets after x, y has been applied
  */
  @Input() offset: Offset = {
    top: 0,
    left: 0
  };
  @Output() hiddenChange = new EventEmitter();
  /**
  * Emitted event when alert is dismissed
  */
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('alert') alert;

  private states = {
    loaded: false,
    show: true
  };

  private store = {
    target: {
      position: {},
      size: {}
    },

    source: {
      position: {},
      size: {},
      isOutOfViewport: false
    }
  };

  private debug = {
    enabled: false,
    style: {
      'position':        'fixed',
      'left':            '20px',
      'bottom':          '20px',
      'padding':         '10px',
      'backgroundColor': 'rgba(255,255,255,0.9)',
      'fontSize':        '1.2rem',
      'fontWeight':      '700'
    }
  }

  private types:any = {
    'success': 'usa-alert-success',
    'warning': 'usa-alert-warning',
    'error': 'usa-alert-error',
    'info': 'usa-alert-info'
  };

  private position: any = {};

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    if (this.dismissTimer > 0) {
      setTimeout(() => {
        this.close();
      }, this.dismissTimer);
    }

    if(this.states.show && this.target !== undefined) {
      this.setPosition();
    }

    this.states.loaded = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.states.show && changes['target'] !== undefined) {
      this.setPosition();
    }
  }

  get selectedType() {
    let type = this.types['success'];

    if(!this.typeNotDefined()) {
      type = this.types[this.type];
    }

    return type;
  }

  @Input()
  get hidden() {
    return !this.states.show;
  }

  set hidden(isHidden) {
    const open = !isHidden;

    if(open && this.dismissTimer > 0) {
      this.open();

      setTimeout(() => {
        this.close();
      }, this.dismissTimer);
    } else {
      open ? this.open() : this.close();
    }
  }

  public open() {
    if(this.states.loaded && this.target !== undefined) {
      this.setPosition();
    }

    this.states.show = true;
    this.hiddenChange.emit(true);
  }

  private close() {
    this.states.show = false;
    this.hiddenChange.emit(false);
    this.dismiss.emit();
  }

  private typeNotDefined() {
    if(!this.type || this.type.length == 0) {
      return true;
    }

    if(!this.types[this.type]) {
      return true;
    }

    return false;
  }

  private setPosition() {
    if(this.target == undefined) {
      return;
    }

    let body = document.body,
        target = this.target,
        source = this.alert.nativeElement,
        type = target.constructor.name,
        viewport = {
          width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        },

        placement = (this.placement || '').replace(/\s+/, ' '),
        offsets,
        dimensions,

        delta = {
          top: 0,
          left: 0
        },

        style = {
          position: 'absolute',
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          margin: 0,
          zIndex: '1337'
        },

        isOutOfViewport;

    /**
     * Select DOM Target
     */
    switch(type) {
      case 'String':
        target = (target == 'body') ? document.body : document.querySelector(target);
        break;

      case 'ElementRef':
        target = target.nativeElement;
        break;

      default:
        if(type.search(/HTML/i) == - 1) {
          console.warn(`@Input target => Does not support object type: ${target.constructor.name}`);
          return style;
        }

        break;
    }

    /**
     * Return if Element is not defined
     */
    if(!target) {
      console.warn('@Input target was not found in the DOM or there was an issue with the object passed in');
      return;
    }

    /**
     * Get Elements' offset positions
     */
    offsets = {
      body: this.getPosition(body, false),
      target: this.getPosition(target, false),
      source: this.getPosition(source, true)
    };

    /**
     * Get Elements' natural width/height
     */
    dimensions = {
      body: this.getDimensions(body),
      target: this.getDimensions(target),
      source: this.getDimensions(source)
    };

    /**
     * Reset the alerts offset position to [0,0]
     */
    style.top = offsets.source.y;
    style.left = offsets.source.x;

    style.width = dimensions.source.width;
    style.height = dimensions.source.height;

    /**
     * Line up the top left corner positions of the alert to the target element
     */
    style.top += offsets.target.top;
    style.left += offsets.target.left;

    /**
     * Determine placement settings and process position adjustments
     */
    placement = (placement.indexOf(' ') > -1 ? placement : `${placement}`) || '';

    if(placement.search(/(^top)|(top$)/) > -1)
      style.top -= dimensions.source.height;
    if(placement.search(/(^bottom)|(bottom$)/) > -1)
      style.top += dimensions.target.height;
    if(placement.search(/(^left)|(left$)/) > -1)
      style.left -= dimensions.source.width;
    if(placement.search(/(^right)|(right$)/) > -1)
      style.left += dimensions.target.width;

    if(placement.search(/^(center (top|bottom))|((top|bottom) center)$/) > -1)
      style.left += (dimensions.target.width / 2) - (dimensions.source.width / 2);
    if(placement.search(/^(center (left|right))|((left|right) center)/) > -1)
      style.top += (dimensions.target.height / 2) - (dimensions.source.height / 2);

    /**
     * Viewport Collision Support
     */
    isOutOfViewport = (
      (style.left + style.width) > viewport.width ||
      style.left < 0 ||
      (style.top + style.height) > viewport.height ||
      style.top < 0
    );

    if(isOutOfViewport) {
      offsets.source.x += Math.abs(style.left);
      offsets.source.y += Math.abs(style.top);

      //style.left = Math.max(0, Math.min(viewport.width - style.width, offsets.source.x + style.width));
      //style.top = Math.max(0, Math.min(viewport.height - style.height, offsets.source.y + style.height));
    }

    // Apply @Input offsets
    style.top += this.offset.top || 0;
    style.left += this.offset.left || 0;

    // Adjust for scroll
    style.top -= window.pageYOffset;
    style.left -= window.pageXOffset;

    /**
     * Debugging Data for Positiong
     */
    this.store.target.position = this.getPosition(target, false);
    this.store.source.position = this.getPosition(source, false);

    this.store.target.size = this.getDimensions(target);
    this.store.source.size = this.getDimensions(source);

    this.store.source.isOutOfViewport = isOutOfViewport;

    source.style.cssText = this.toPx(style);
  }

  private getDimensions(element) {
    let computed,
        dimensions,
        display;

    display = element.style.display;
    element.style.display = 'inline-block';
    computed = window.getComputedStyle(element),
    dimensions = {
      width: +parseFloat(computed.width || "0").toFixed(1),
      height: +parseFloat(computed.height || "0").toFixed(1)
    };

    element.style.display = display;

    return dimensions;
  }

  private getPosition(element, reset: boolean) {
    let position = {
          top:  0,
          left: 0,
          x:    0,
          y:    0
        },

        styles = element.style,
        newStyles = 'position:fixed;margin:0px;visibility:visible;display:block;',
        bounds,

        intLevel = 0;

    reset = reset || false;

    if(element.tagName !== 'BODY') {
      if(reset) {
        newStyles += 'top:0px;left:0px;';
      }

      element.style.cssText = newStyles;
    }

    while(element) {
      bounds = element.getBoundingClientRect();

      position.top = Math.max(position.top, bounds.top);
      position.left = Math.max(position.left, bounds.left);

      if(element.tagName !== 'BODY' && !intLevel) {
        element.style.cssText = styles;
      }

      element = element.offsetParent;

      intLevel++;
    }

    position.x = position.left * -1;
    position.y = position.top * -1;

    return position;
  }

  private toPx(styles) {
    const px = (value) => `${value}px`;
    let inlineStyles = '',
        style;

    for(style in styles) {
      if(typeof styles[style] == 'number') {
        styles[style] = px(styles[style]);
      }

      inlineStyles += `${style}: ${styles[style]};`;
    }

    return inlineStyles;
  }
}

export interface Offset {
  top?:  number;
  left?: number;
};
