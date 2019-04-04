import { Component, Input } from '@angular/core';


@Component({
  selector: 'sam-header-v2',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class SamHeaderComponent {

  /**
   * 
   */
  @Input() model: HeaderModel;

  /**
   * Takes in a text string and removes all white space characters and returns the new string
   * @param text 
   */
  removeWhiteSpace(text: string) {
    return text.replace(/ /g, '');
  }

}

/**
 * 
 */
export interface HeaderModel {
  home: HeaderHome;
  secondaryLinks: HeaderSecondaryLink[];
  navigationLinks: HeaderNavigationLink[];
}

/**
 * 
 */
export interface HeaderHome {
  /**
   * 
   */
  text: string;

  /**
   * 
   */
  route: string;

  /**
   * 
   */
  imageSourcePath: string;

  /**
   * 
   */
  imageAltText: string;
}

/**
 * 
 */
export interface HeaderNavigationLink {
  /**
   * 
   */
  text: string;

  /**
   * 
   */
  route: string;

  /**
   * 
   */
  children: HeaderNavigationLink[];
}

/**
 * 
 */
export interface HeaderSecondaryLink {
  /**
   * 
   */
  text: string;

  /**
   * 
   */
  route: string;

  /**
   * 
   */
  imageSourcePath: string;

  /**
   * 
   */
  imageAltText: string;
}
