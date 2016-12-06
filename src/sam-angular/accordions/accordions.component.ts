import {Component, Input} from '@angular/core';

/**
 * The <samAccordions> component can generate accordions component with provided data
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input accordionsName: string - name for the accordions
 * @Input accordionsData: array - Contains all the data for each accordion [{title:"", content:""},...]
 * @Input bordered: boolean - Control whether the accordion component has a border
 */
@Component({
    selector: 'samAccordions',
    template: `<div [ngClass]="accordionsClass">
              <ul class="usa-unstyled-list">
                <li *ngFor="let accordion of accordionsData; let i = index">
                  <button class="usa-button-unstyled" [attr.aria-expanded]="isExpanded(i)" [attr.aria-controls]="accordionsName+'_accordions-'+i" (click)="setExpandIndex(i)">{{accordion.title}}</button>
                  <div [id]="accordionsName+'_accordions-'+i" [attr.aria-hidden]="!isExpanded(i)" class="usa-accordion-content">{{accordion.content}}</div>
                </li>
              </ul>
            </div>`,
    styleUrls: ['accordions.style.css']
})
export class SamAccordionsComponent {

    @Input() accordionsName:string;
    @Input() accordionsData:any;
    @Input() bordered:boolean;

    accordionsClass:string;
    expandIndex = -1;

    constructor() {
    }

    ngOnInit() {
        if (!this.accordionsName) {
            throw new Error("<samAccordions> required a [accordionsName] parameter for 508 compliance");
        }

        this.accordionsClass = "usa-accordion";
        if (this.bordered) {
            this.accordionsClass = "usa-accordion-bordered";
        }
    }


    isExpanded(i):boolean {
        return this.expandIndex === i;
    }

    setExpandIndex(i) {
        if (this.expandIndex === i) {
            this.expandIndex = -1;
        } else {
            this.expandIndex = i;
        }
    }

}
