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
  @Input() label: string = 'Phone Number';
  @Input() model: string = "";
  @Input() prefix: string = "";

  @ViewChild("phoneInput") phoneInput;
  @Output() emitter = new EventEmitter<string>();

  errorMsg: string = "";
  @Input() phoneNumberTemplate: string = "_+(___)___-____";
  phoneNumberTemplateLength = this.phoneNumberTemplate.length;
  phoneNumberMirror = this.phoneNumberTemplate;
  phoneNumber = this.phoneNumberTemplate;
  badIndex = [];
  //1,2,6,10
  constructor() {}

  ngOnInit() {
    this.phoneNumberTemplateLength = this.phoneNumberTemplate.length;
    for(var i = 0; i < this.phoneNumberTemplate.length; i++){
      if(this.phoneNumberTemplate.charAt(i)!="_"){
        this.badIndex.push(i);
      }
    }
    
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
      this.phoneInput.nativeElement.value = updatedPhoneNumber.substr(0,this.phoneNumberTemplate.length);
      this.phoneNumber = updatedPhoneNumber.substr(0,this.phoneNumberTemplate.length);
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
    for(var i = pos+1; i < this.phoneNumberTemplate.length; i++){
      if(this.phoneNumberTemplate.charAt(i)=="_"){
        return i;
      }
    }
    return pos+1;
  }

  getPositionDecrement(pos) {
    for(var i = pos-1; i >= 0; i--){
      if(this.phoneNumberTemplate.charAt(i)=="_"){
        return i;
      }
    }
    if(pos-1>0){
      return pos-1;  
    }
    return 0;
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
