import { Component, Input } from '@angular/core';
import { HistoryNodeType } from '../../types';
@Component({
  selector: 'sam-history',
  templateUrl: 'history.template.html'
})
export class SamHistoryComponent {
  /**
   * sets the id for history items
   */
  @Input() id: string;
  /**
   * sets the model for generating nodes
   */
  @Input() data: HistoryNodeType[];
  /**
   * Sets the 'current' node on the id value defined in data
   */
  @Input() currentId: string;

}
