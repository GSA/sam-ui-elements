import { Component, Input } from '@angular/core';


@Component({
  selector: 'sam-footer-v2',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class SamFooterComponent {

  /**
   * 
   */
  @Input() model: FooterModel;
}

export interface FooterModel {
  /**
   * 
   */
  linkSections: FooterLinkSection[];
  /**
   * 
   */
  footerLogo: FooterLogo;
}

export interface FooterLinkSection {
  /**
   * 
   */
  text: string;
  /**
   * 
   */
  links: FooterLink[];
}

export interface FooterLink {
  /**
   * 
   */
  text: string;
  /**
   * 
   */
  route: string;
}

export interface FooterLogo {
  /**
   * 
   */
  text: string;

  /**
   * 
   */
  imageSourcePath: string;

  /**
   * 
   */
  imageAltText: string;
}


