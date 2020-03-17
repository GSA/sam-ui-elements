import {
  Component,
  Inject,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';


/**
 * The <sam-accordion-section> component can generates content for a single 
 * accordion item
 */
@Component({
  selector: 'sam-accordion-section',
  templateUrl: 'accordion.template.html'
})
export class SamAccordionSection implements OnInit {
  /**
   * Accordion header text
   */
  @Input() headerText: string;
  /**
   * Defines whether accordion item should be expanded when loaded
   */
  @Input() isExpanded: boolean;
  /**
   * Populates the 'name' attribute for the accordion item for 508 compliance
   */
  @Input() name: string;
  /**
   * The accordion section that has changed is emitted back to parent
   */
  @Output() isExpandedChange: EventEmitter<SamAccordionSection> =
    new EventEmitter<SamAccordionSection>();

  constructor(
    @Inject(forwardRef(() => SamAccordionComponent))
    private parent: any
  ) {
    this.parent.addSection(this);
  }

  ngOnInit() {
    if (!this.name) {
      throw new Error(
        '[name] is a required input for the <sam-accordian-section> component'
      );
    }
  }

  public toggle() {
    this.isExpanded = !this.isExpanded;
    this.isExpandedChange.emit(this);
  }

  public collapse() {
    this.isExpanded = false;
  }

  public expand() {
    this.isExpanded = true;
  }

  public index() {
    let index = -1;
    for (let i = 0; i < this.parent.sections.length; i++) {
      if (this.parent.sections[i] === this) {
        index = i;
        break;
      }
    }
    return index;
  }
}

/**
 * The <sam-accordion> component can generate accordions component with provided
 * data
 */
@Component({
  selector: 'sam-accordion',
  template: `
    <div class='accordion-list' [ngClass]='accordionClass'>
      <ng-content></ng-content>             
    </div>
`,
})
export class SamAccordionComponent implements OnInit {
  /**
   * Control whether the accordion component has a border
   */
  @Input() bordered: boolean = false;
  /**
   * Index of an accordion item that should be expanded on load
   */
  @Input() expandIndex = -1;
  /**
   * The index of the accordion item that has been opened/closed
   */
  @Output() selectedIndexChange: EventEmitter<number> =
    new EventEmitter<number>();

  public accordionClass: string = 'usa-accordion';
  public sections: SamAccordionSection[] = [];

  ngOnInit() {
    if (this.bordered) {
      this.accordionClass = 'usa-accordion-bordered';
    }
    this.setExpandIndex(this.expandIndex);
  }

  addSection(section: SamAccordionSection) {
    this.sections.push(section);
    section.isExpandedChange.subscribe(s => {
      this.expandedChanged(s);
    });
  }

  expandedChanged(section: SamAccordionSection) {
    this.expandIndex = section.isExpanded ? section.index() : -1;
    this.collapseOthers(section);
    this.selectedIndexChange.emit(this.expandIndex);
  }

  collapseOthers(section: SamAccordionSection) {
    this.sections.forEach(s => {
      if (s !== section) {
        s.collapse();
      }
    });
  }

  collapseAll() {
    this.sections.forEach(s => {
      s.collapse();
    });
  }

  setExpandIndex(index) {
    this.expandIndex = index;
    this.sections.forEach((section, i) => {
      if (i === index) {
        section.expand();
      } else {
        section.collapse();
      }
    });
  }
}


