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
  home:HeaderHome;
  secondaryLinks: HeaderSecondaryLink[];
  navigationLinks: HeaderNavigationLink[];
}

export class HeaderHome{
  text: string;
  route: string;
  imageSourcePath:string;
  imageAltText: string;
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
