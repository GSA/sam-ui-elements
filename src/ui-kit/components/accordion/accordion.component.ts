import { Component, Inject, forwardRef } from '@angular/core';
import { Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * The <samAccordionSection> component can generates content for a single accordion item
 *
 * @Input headerText: string - Accordion header text
 * @Input isExpanded: boolean - Defines whether accordion item should be expanded when loaded
 * @Input name: string - populates the 'name' attribute for the accordion item for 508 compliance
 * @Output isExpandedChange: object - The accordion section that has changed is emitted back to parent
 */
@Component({
  selector: 'samAccordionSection',
  templateUrl: 'accordion.template.html'
})
export class SamAccordionSection implements OnInit {
  
  @Input() headerText: string;
  @Input() isExpanded: boolean;
  @Input() name: string;
  @Output() isExpandedChange: EventEmitter<SamAccordionSection> = new EventEmitter<SamAccordionSection>();

  constructor(
    @Inject(forwardRef(() => SamAccordionComponent))
    private parent:SamAccordionComponent
  ) {
    this.parent.addSection(this);
  }

  ngOnInit() {
    if (!this.name) {
      throw new Error("[name] is a required input for the <samAccordianSection> component");
    }
  }

  private toggle() {
    this.isExpanded = !this.isExpanded;
    this.isExpandedChange.emit(this);
  }

  collapse() {
    this.isExpanded = false;
  }

  expand() {
    this.isExpanded = true;
  }

  index() {
    let index = -1;
    for(var i = 0; i < this.parent.sections.length; i++) {
      if(this.parent.sections[i] == this) {
        index = i;
        break;
      }
    }
    return index;
  }
}

/**
 * The <samAccordions> component can generate accordions component with provided data
 */
@Component({
  selector: 'samAccordion',
  template: `
    <ul class="accordion-list" [ngClass]="accordionClass">
      <ng-content></ng-content>             
    </ul>
`,
})
export class SamAccordionComponent implements OnInit {
  /**
  * Control whether the accordion component has a border
  */
  @Input() bordered:boolean = false;
  /**
  * Index of an accordion item that should be expanded on load
  */
  @Input() expandIndex = -1;
  /**
  * The index of the accordion item that has been opened/closed
  */
  @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();

  public accordionClass:string = "usa-accordion";
  public sections: SamAccordionSection[] = [];

  constructor() {

  }

  ngOnInit() {
    if (this.bordered) {
      this.accordionClass = "usa-accordion-bordered";
    }
    this.setExpandIndex(this.expandIndex);
  }

  addSection(section: SamAccordionSection) {
    this.sections.push(section);
    section.isExpandedChange.subscribe(s => {
      this.expandedChanged(s);
    })
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


