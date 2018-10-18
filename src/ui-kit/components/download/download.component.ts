import {
  Component,
  Input
 } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DownloadPackageType } from '../../types';

/**
 * Sam Download Component
 */
@Component({
  selector: 'sam-download',
  templateUrl: 'download.template.html',
  animations: [
    trigger('accordion', [
      state('collapsed', style({
        height: '0px',
      })),
      state('expanded', style({
        height: '*',
      })),
      transition('collapsed => expanded', animate('100ms ease-in')),
      transition('expanded => collapsed', animate('100ms ease-out'))
    ]),
    trigger('intro', [
      state('fade', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-30%)'
        }),
        animate('.5s .5s cubic-bezier(0.175, 0.885, 0.320, 1.275)')
      ]),
      transition('* => void', [
        animate('.5s cubic-bezier(0.175, 0.885, 0.320, 1.275)', style({
          opacity: 0,
          transform: 'translateY(-30%)'
        }))
      ])
    ])
  ]
})
export class SamDownloadComponent {
  /**
   * model for populating downloads
   */
  @Input() public packages: DownloadPackageType[] = [];
  /**
   * pass in an attachment error to trigger a message
   */
  @Input() public attachmentError: boolean = false;
  /**
   * sets download all url link
   */
  @Input() public downloadAllUrl: string;

  public hasPublicPackages() {
    for (const pkg of this.packages){
      if (pkg.access.toLowerCase() === 'public') {
        return true;
      }
    }
    return false;
  }

  public toggleAccordion(card) {
    card.accordionState =
      card.accordionState === 'expanded' ? 'collapsed' : 'expanded';
  }

  private isSecure(field: string) {
    if (field.toLowerCase() === 'public') {
      return 'Public';
    } else {
      return 'Secured';
    }
  }
}
