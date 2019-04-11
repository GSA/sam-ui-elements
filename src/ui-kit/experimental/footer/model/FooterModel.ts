
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
  
  
  