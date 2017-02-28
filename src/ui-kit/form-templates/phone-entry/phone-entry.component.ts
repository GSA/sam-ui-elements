import { Component, Input, ViewChild,Output, EventEmitter,OnInit } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';

/**
 * The <samPhoneInput> component is a Phone entry portion of a form
 *
 * @Input label: string - The lable text to appear above the input
 * @Input model: string - Angular model string value, should match the format of the phoneNumberTemplate
 * @Input phoneNumberTemplate: string - String value that is the phone number should match. Default is "_+(___)___-____" (underscores denote where numbers are allowed)
 * @Input prefix: string - Prefix name/id attribute values
 * @Output emitter: string - Event emitter when model changes, outputs a string
 */
@Component( {
  selector: 'samPhoneEntry',
  templateUrl: 'phone-entry.template.html',
})
export class SamPhoneEntryComponent implements OnInit {
  /**
  * The label text to appear above the input
  */
  @Input() label: string = 'Phone Number';
  /**
  * Angular model string value, should match the format of the phoneNumberTemplate
  */
  @Input() model: string = "";
  /**
  * Prefix name/id attribute values
  */
  @Input() prefix: string = "";
  /**
   * Is required?
   */
  @Input() required: boolean = false;
  /**
  * Event emitter when model changes, outputs a string
  */
  @Output() emitter = new EventEmitter<string>();

  @ViewChild("phoneInput") phoneInput;

  errorMsg: string = "";
  phoneNumberTemplate = "_+(___)___-____";
  phoneNumberMirror = this.phoneNumberTemplate;
  phoneNumber = this.phoneNumberTemplate;
  badIndex = [1,2,6,10];

  constructor() {}

  ngOnInit() {
    if(this.model.length>0) {
      this.phoneNumberMirror = this.model;
      this.phoneNumber = this.model;
    }
  }

  getIdentifier(str) {
    if(this.prefix.length>0) {
      str = this.prefix + "-" + str;
    }

    return str;
  }

  process(event) {
    let start = this.phoneInput.nativeElement.selectionStart;
    let end = this.phoneInput.nativeElement.selectionEnd;

    if(!isNaN(event.key)) {
      let updatedPhoneNumber = this.phoneNumber;
      let positionIncrement = this.getPositionIncrement(start);
      let replacePos = start;

      if(this.badIndex.indexOf(start)>=0) {
        replacePos = positionIncrement;
        positionIncrement = this.getPositionIncrement(positionIncrement);
      }

      if(start!=end) {
        for(let idx=start; idx < end; idx++) {
          if(this.badIndex.indexOf(idx)==-1) {
            updatedPhoneNumber = this.replaceAt(idx,"_",updatedPhoneNumber);
          }
        }
      }

      updatedPhoneNumber = this.replaceAt(replacePos,event.key,updatedPhoneNumber);
      this.phoneInput.nativeElement.value = updatedPhoneNumber.substr(0,15);
      this.phoneNumber = updatedPhoneNumber.substr(0,15);
      this.phoneInput.nativeElement.setSelectionRange(positionIncrement,positionIncrement);
    } else if(event.key=="Backspace") {
      let positionDecrement = this.getPositionDecrement(start);

      event.preventDefault();

      if(start!=end) {
        for(let idx=start; idx < end; idx++) {
          if(this.badIndex.indexOf(idx)==-1) {
            this.phoneNumber = this.replaceAt(idx,"_",this.phoneNumber);
          }
        }
        positionDecrement = start;
      } else {
        this.phoneNumber = this.replaceAt(positionDecrement,"_",this.phoneNumber).substr(0,16);
      }
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(positionDecrement,positionDecrement);
    } else if(event.key=="ArrowRight" || event.key=="ArrowLeft") {
      this.phoneInput.nativeElement.setSelectionRange(start,end);
    } else {
      //don't change
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(start,start);
    }
    /*
    let updateModel = this.phoneNumber.replace(/\(/g,'');
    updateModel = updateModel.replace(/\)/g,'-');
    updateModel = updateModel.replace(/\+/g,'-');
    updateModel = updateModel.replace(/_/g,'');
    updateModel = updateModel.replace(/^\D+/g,'');
    this.model = updateModel;
    */
    let updateModel = this.phoneNumber;

    this.model = updateModel;
    this.emitter.emit(this.model);
  }

  getPositionIncrement(pos) {
    switch(pos) {
      case 0:
      case 1:
      case 2:
        return 3;
      case 5:
      case 6:
        return 7;
      case 9:
      case 10:
        return 11;
      default:
        return pos+1;
    }
  }

  getPositionDecrement(pos) {
    switch(pos) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 0;
      case 6:
      case 7:
        return 5;
      case 10:
      case 11:
        return 9;
      default:
        return pos-1;
    }
  }

  check() {
    let error = false;
    let digitCount = this.model.replace(/[^0-9]/g,"").length;

    if(digitCount < 11) {
      if((digitCount == 10 && this.model.match(/^\d/g)) || digitCount < 10) {
        error = true;
        this.errorMsg = "Invalid phone number";
      }
    }

    if(!error) {
      this.errorMsg = "";
    }
  }

  replaceAt(index, character, str) {
    return str.substr(0, index) + character + str.substr(index+character.length);
  }
}
