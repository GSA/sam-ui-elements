import { Component, Input } from '@angular/core';
import { PointOfContactType } from '../../types';

/**
 * The <sam-poc> component outputs Point of Contact information
 */
@Component({ selector: 'sam-poc',
  templateUrl: 'point-of-contact.template.html'
})
export class SamPointOfContactComponent {
  /**
   * Populates the component with the provided data
   */
  @Input() data: PointOfContactType;
}
