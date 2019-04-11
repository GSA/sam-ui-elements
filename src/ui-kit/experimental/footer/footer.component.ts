import { Component, Input } from '@angular/core';
import { FooterModel } from './model/FooterModel';


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
