import { Component, Input, ViewChild, TemplateRef, ElementRef, forwardRef } from '@angular/core';


@Component({
  selector: 'sam-header-v2',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class SamHeaderComponent {
  @Input() model: HeaderModel;

  removeWhiteSpace(text: string) {
    return text.replace(/ /g, '');
  }

}

export class HeaderModel {
  secondaryLinks: HeaderSecondaryLink[];
  navigationLinks: HeaderNavigationLink[];
}

export class HeaderNavigationLink {
  text: string;
  route: string;
  children: HeaderNavigationLink[];
}

export class HeaderSecondaryLink {
  text: string;
  route: string;
  imageSourcePath: string;
  imageAltText: string;
}
