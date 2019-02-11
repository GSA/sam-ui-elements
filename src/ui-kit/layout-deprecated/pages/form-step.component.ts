import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';


@Component ({
  selector: 'form-step',
  template: `
    <page 
      [breadcrumbs]="crumbs" 
      (breadcrumbChange)="breadcrumbHandler($event)"
      theme="inside"
      [section]="sectionTitle" 
      [title]="pageTitle"
      [type]="type"
      [typeLabel]="typeLabel">
      
      <sidebar>
        <div sam-sticky limit=1200 container="page-content">
          <img *ngIf="sideNavImage"
            src="{{sideNavImage}}"
            alt="{{sideNavImageAlt}}"/>
          <sam-sidenav 
            type="step"
            (selection)="navHandler($event)" 
            [labelLookup]="sideNavSelection" 
            [model]="sideNavModel">
          </sam-sidenav>
        </div>
      </sidebar>
      
      <ng-container *ngIf="alerts && alerts.length > 0">
        <div *ngFor="let alert of alerts; let i = index">
            <sam-alert
                [attr.id]="'program-alert-' + i"
                [type]="alerts[i].config.type"
                [title]="alerts[i].config.title">
                <div [innerHTML]="alerts[i].config.description"></div>
            </sam-alert>
        </div>
       </ng-container>
      
      <ng-container message>
        <sam-alert *ngIf="statusBannerLeadingText"
                           [type]="statusBannerType"
                           [(showMoreToggle)]="statusBannerExpanded"
                           (toggle)="statusBannerExpandedChange.emit($event)">
          <div leading-content>{{statusBannerLeadingText}}</div>
          <div main-content>
            <ng-content select="[status-banner]"></ng-content>
          </div>
        </sam-alert>
      </ng-container>

      <ng-content select="[form-sections]">
      </ng-content>    
      
      <div class="sam-ui divider"></div> 
      
      <div grid>
        <div columns="12" class="right aligned">
          <sam-button 
            [isDisabled]="disabled"
            [buttonId]="'fal-form-nav-cancel'" 
            buttonType="tertiary" 
            buttonText="Cancel" 
            (onClick)="formAction('cancel')">
          </sam-button>
          
          <sam-button 
            [isDisabled]="disabled"
            [buttonId]="'fal-form-nav-back'" 
            buttonType="secondary" 
            *ngIf="sectionIndex - 1 >= 0" 
            buttonText="Back" 
            (onClick)="formAction('back')">
          </sam-button>
          
          <sam-button
            [isDisabled]="disabled" 
            [buttonId]="'fal-form-nav-next'"
            buttonType="secondary" 
            *ngIf="sectionIndex + 1 < numberOfSections" 
            buttonText="Next" 
            (onClick)="formAction('next')">
          </sam-button>
          
          <sam-button
            [isDisabled]="disabled" 
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
export class FormStepComponent implements OnChanges, AfterViewInit {
  /**
   * Sets breadcrumbs model
   */
  @Input() crumbs;
  /**
   * Sets sidenav model
   */
  @Input() sideNavModel;
  /**
   * Sets sidenav selection
   */
  @Input() sideNavSelection;
  /**
   * Sets sidenav image src
   */
  @Input() sideNavImage;
  /**
   * Sets sidenav image alt
   */
  @Input() sideNavImageAlt;
  /**
   * Used to toggle appearance of back/next buttons
   */
  @Input() sectionIndex: number;
  /**
   * Sets number of sections 
   */
  @Input() numberOfSections: number;
  /**
   * Sets section title
   */
  @Input() sectionTitle: string;
  /**
   * Sets page title
   */
  @Input() pageTitle: string;
  /**
   * Sets form step type 
   */
  @Input() type: string;
  /**
   * Sets the page component typelabel input
   */
  @Input() typeLabel: string;
  /**
   * Sets the banner alert type
   */
  @Input() statusBannerType: string = 'error';
  /**
   * Sets the banner leading text
   */
  @Input() statusBannerLeadingText: string;
  /**
   * Sets the state of the banner
   */
  @Input() statusBannerExpanded: boolean = false;
  /**
   * Passes in a tab component 
   */
  @Input() tabsComponent: any;
  /**
   * Override to toggle buttons on/off if there are external errors
   */
  @Input() hasErrors: any;
  /**
   * Passes in an Alerts model
   */
  @Input() alerts: any;
  /**
   * Disables form buttons
   */
  @Input() disabled: boolean = false;
  /**
   * Emitter for general events
   */
  @Output() action = new EventEmitter();
  /**
   * (deprecated) Emitter for sidenav events
   */
  @Output() sideNavOutput = new EventEmitter();
  /**
   * Emitter for sidenav events
   */
  @Output() sideNavChange = new EventEmitter();
  /**
   * (deprecated) Emitter for breadcrumb events
   */
  @Output() public breadcrumbOut = new EventEmitter();
  /**
   * Emitter for breadcrumb events
   */
  @Output() public breadcrumbChange = new EventEmitter();
  /**
   * Emitter for status banner events
   */
  @Output() statusBannerExpandedChange = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.toggleButtons(this.hasErrors);
  }

  breadcrumbHandler(evt) {
    this.breadcrumbOut.emit(evt);
    this.breadcrumbChange.emit(evt);
  }

  formAction(evtStr) {
    this.action.emit({event: evtStr});
  }

  navHandler(evt) {
    this.sideNavOutput.emit(evt);
    this.sideNavChange.emit(evt);
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
