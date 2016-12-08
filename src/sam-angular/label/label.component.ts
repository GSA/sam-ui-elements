import {Component, Input} from '@angular/core';

/**
 * The <samLabel> component can generate a label matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input labelType: string - 'small': display small label
 *                       'big': display big label
 * @Input labelText: the text content that will show on the label
 */
@Component({
  selector: 'samLabel',
  template: `<span [ngClass]="labelClass()">{{labelText}}</span>`,
})
export class SamLabelComponent {

  @Input() labelType:string;
  @Input() labelText:string;


  constructor() {

  }

  ngOnInit() {
  }

  /**
   * Set up the SAMWDS class for the label according to the size of the label
   */
  private labelClass():string{
    if(this.labelType === "small"){
      return 'usa-label' ;
    } else if(this.labelType === "big") {
      return 'usa-label-big';
    }
  }


}


