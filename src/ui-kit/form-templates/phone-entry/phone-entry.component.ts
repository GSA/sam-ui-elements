import { Component, Input, ViewChild,Output, EventEmitter,OnInit } from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';

/**
 * The <samPhoneInput> component is a Phone entry portion of a form
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
  * String value that is the phone number should match. Default is "_+(___)___-____" (underscores denote where numbers are allowed)
  */
  @Input() phoneNumberTemplate: string = "_+(___)___-____";
  /**
  * Prefix name/id attribute values
  */
  @Input() prefix: string = "";
  /**
  * Flag to determine whether Phone Entry is required for submission
  */
  @Input() required: boolean = false;
  /**
  * Flag for when model is only numbers
  */
  @Input() numbersOnly: boolean;
  /**
  * Event emitter when model changes, outputs a string
  */
  @Output() emitter = new EventEmitter<string>();

  @ViewChild("phoneInput") phoneInput;
  errorMsg: string = "";
  
  phoneNumberTemplateLength = this.phoneNumberTemplate.length;
  phoneNumberMirror = this.phoneNumberTemplate;
  phoneNumber = this.phoneNumberTemplate;
  badIndex = [];
  constructor() {}

  ngOnInit() {
    this.phoneNumberTemplateLength = this.phoneNumberTemplate.length;
    for(var i = 0; i < this.phoneNumberTemplate.length; i++){
      if(this.phoneNumberTemplate.charAt(i)!="_"){
        this.badIndex.push(i);
      }
    }
    
    if(this.model.length>0) {
      var phoneNum = this.model;
      if(this.numbersOnly){
        phoneNum = this.formatWithTemplate(phoneNum);
      }
      this.phoneNumberMirror = phoneNum;
      this.phoneNumber = phoneNum;
    }
  }
  
  formatWithTemplate(numberStr:string){
    var templateStr = this.phoneNumberTemplate;
    var idx = 0;
    while(templateStr.indexOf('_') > -1 && idx < numberStr.length) {
      templateStr = templateStr.replace(/_/, numberStr.charAt(idx++));
    }
    return templateStr;
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
    
    //if a number
    if( (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) ) {
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
      this.phoneInput.nativeElement.value = updatedPhoneNumber.substr(0,this.phoneNumberTemplate.length);
      this.phoneNumber = updatedPhoneNumber.substr(0,this.phoneNumberTemplate.length);
      this.phoneInput.nativeElement.setSelectionRange(positionIncrement,positionIncrement);
    } 
    //if backspace
    else if(event.keyCode==8){
      let positionDecrement = this.getPositionDecrement(start);
      event.preventDefault();
      if(start!=end) {
        //for selections
        for(let idx=start; idx < end; idx++) {
          if(this.badIndex.indexOf(idx)==-1) {
            this.phoneNumber = this.replaceAt(idx,"_",this.phoneNumber);
          }
        }
        positionDecrement = start;
      } else {
        //single characters
        this.phoneNumber = this.replaceAt(positionDecrement,"_",this.phoneNumber).substr(0,16);
      }
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(positionDecrement,positionDecrement);
    } 
    //left or right
    else if(event.keyCode==37 || event.keyCode==39) {
      this.phoneInput.nativeElement.setSelectionRange(start,end);
    } else {
      //don't change
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(start,start);
    }
    
    let updateModel = this.phoneNumber;
    if(this.numbersOnly){
      for(var idx in this.badIndex){
        updateModel = this.replaceAt(this.badIndex[idx],"_",updateModel);
      }
      this.model = updateModel.replace(/_/g,"");
    } else {
      this.model = updateModel;
    }
    this.emitter.emit(this.model);
  }

  getPositionIncrement(pos) {
    if(this.phoneNumberTemplate.indexOf('_', pos + 1)==-1){
      return pos+1;
    }
    return this.phoneNumberTemplate.indexOf('_', pos + 1);
  }

  getPositionDecrement(pos) {
    if(this.phoneNumberTemplate.lastIndexOf("_", pos - 1)==-1){
      return this.phoneNumberTemplate.indexOf("_");
    }
    return this.phoneNumberTemplate.lastIndexOf("_", pos - 1);
  }

  check() {
    let error = false;
    let digitCount = this.model.replace(/[^0-9]/g,"").length;
    let correctDigitCount = this.phoneNumberTemplate.replace(/[^_]/g,"").length;
    if(digitCount < correctDigitCount) {
      if((digitCount == correctDigitCount-1 && this.model.match(/^\d/g)) || digitCount < correctDigitCount-1) {
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
