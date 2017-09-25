import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef} from "@angular/core";


@Component ({
  selector: 'form-step',
  template: `
    <page 
      [breadcrumbs]="crumbs" 
      (breadcrumbOut)="breadcrumbHandler($event)"
      theme="inside"
      [section]="sectionTitle" 
      [title]="pageTitle">
      
      <sidebar>
        <div sam-sticky limit=1200 container="page-content">
          <img *ngIf="sideNavImage" src="{{sideNavImage}}" alt="{{sideNavImageAlt}}"/>
          <sam-sidenav 
            type="step"
            (data)="navHandler($event)" 
            [labelLookup]="sideNavSelection" 
            [model]="sideNavModel">
          </sam-sidenav>
        </div>
      </sidebar>
      
      <ng-container message>
        <sam-status-banner [type]="statusBannerType" *ngIf="statusBannerLeadingText">
          <div leading-content>{{statusBannerLeadingText}}</div>
          <div main-content>
            <ng-content select="[status-banner]"></ng-content>
          </div>
        </sam-status-banner>
      </ng-container>

      <ng-content select="[form-sections]">
      </ng-content>    
      
      <div class="sam-ui divider"></div> 
      
      <div grid>
        <div columns="12" class="right aligned">
          <sam-button 
            [buttonId]="'fal-form-nav-cancel'" 
            buttonType="tertiary" 
            buttonText="Cancel" 
            (onClick)="formAction('cancel')">
          </sam-button>
          
          <sam-button 
            [buttonId]="'fal-form-nav-back'" 
            buttonType="secondary" 
            *ngIf="sectionIndex - 1 >= 0" 
            buttonText="Back" 
            (onClick)="formAction('back')">
          </sam-button>
          
          <sam-button 
            [buttonId]="'fal-form-nav-next'"
            buttonType="secondary" 
            *ngIf="sectionIndex + 1 < numberOfSections" 
            buttonText="Next" 
            (onClick)="formAction('next')">
          </sam-button>
          
          <sam-button 
            [buttonId]="'fal-form-nav-done'" 
            buttonText="Done" 
            (onClick)="formAction('done')">
          </sam-button>
        </div>
      </div>
      
      <div class="sam-ui divider"></div>
    </page>
  `
})
export class FormStepComponent implements OnChanges {
    @Input() crumbs;
    @Input() sideNavModel;
    @Input() sideNavSelection;
    @Input() sideNavImage;
    @Input() sideNavImageAlt;
    @Input() sectionIndex: number;
    @Input() numberOfSections: number;
    @Input() sectionTitle: string;
    @Input() pageTitle: string;
    @Input() statusBannerType:string = "error";
    @Input() statusBannerLeadingText: string;
    @Input() tabsComponent: any;
    @Input() hasErrors: any;
    @Output() action = new EventEmitter();
    @Output() sideNavOutput = new EventEmitter();
    @Output() public breadcrumbOut = new EventEmitter();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnChanges() {
      this.toggleButtons(this.hasErrors);
    }

    breadcrumbHandler(evt){
      this.breadcrumbOut.emit(evt);
    }

    formAction(evtStr){
      this.action.emit({event:evtStr});
    }

    navHandler(evt){
      this.sideNavOutput.emit(evt);
    }

  toggleButtons(hasErrors: boolean) {
      if (hasErrors === true) {
        this.tabsComponent.toggleButtonOnAccess = true;
        this.tabsComponent.toggleButtonOnErrors = true;
        this.cdr.detectChanges();
      } else {
        this.tabsComponent.toggleButtonOnAccess = true;
        this.tabsComponent.toggleButtonOnErrors = false;
        this.cdr.detectChanges();
      }
    }
}
