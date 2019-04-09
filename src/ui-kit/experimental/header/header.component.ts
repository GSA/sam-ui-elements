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

  select(id: string) {
    this.deselect();
    let item = this.find(id);
    if (item) {
      item.selected = true;
    }
  }

  deselect() {
    if (this.model.home) {
      this.model.home.selected = false;
    }
    if (this.model.navigationLinks) {
      this.model.navigationLinks.forEach(function (item: HeaderNavigationLink) {
        item.selected = false;
        if (item.children) {
          item.children.forEach(function (child: HeaderNavigationLink) {
            child.selected = false;
          });
        }
      });
    }
    if (this.model.secondaryLinks) {
      this.model.secondaryLinks.forEach(function (item: HeaderSecondaryLink) {
        item.selected = false;
      });
    }
  }

  find(id: string) {
    if (this.model.home) {
      if (this.model.home.id === id) {
        return this.model.home;
      }
    }
    if (this.model.navigationLinks) {
      this.model.navigationLinks.forEach(function (item: HeaderNavigationLink) {
        if (item.id === id) {
          return item;
        }
        if (item.children) {
          item.children.forEach(function (child: HeaderNavigationLink) {
            if (child.id === id) {
              return child;
            }
          });
        }
      });
    }
    if (this.model.secondaryLinks) {
      this.model.secondaryLinks.forEach(function (item: HeaderSecondaryLink) {
        if (item.id === id) {
          return item;
        }
      });
    }
    return null;
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


export class HeaderHome implements Selectable {
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

  /**
   * 
   */
  id: string;

  /**
   * 
   */
  selected: boolean;
}

/**
 * 
 */
export class HeaderNavigationLink implements Selectable {
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

  /**
   * 
   */
  id: string;

  /**
   * 
   */
  selected: boolean;
}

/**
 * 
 */
export class HeaderSecondaryLink implements Selectable {
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

  /**
   * 
   */
  id: string;

  /**
   * 
   */
  selected: boolean;
}

export interface Selectable {
  /**
 * 
 */
  id: string;

  /**
   * 
   */
  selected: boolean
} 
