import { Component, Input, ViewChild,Output, EventEmitter } from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input/@Output model - the bound value of the component
 * @Input prefix - Prefix name/id attribute values
 *
 */
@Component({
  selector: 'samPhoneEntry',
  template: `
    <labelWrapper [label]="'Phone Number'" [name]="getIdentifer('phone-number')" [errorMessage]="errorMsg">
      <input (blur)="check()" maxlength="15" #phoneInput class="" [value]="phoneNumberTemplate" (keydown)="process($event)" id="{{getIdentifer('phone-number')}}" name="{{getIdentifer('phone-number')}}" type="text">
    </labelWrapper>
  `,
})
export class SamPhoneEntryComponent {
  @Input() model: string = "";
  @Input() prefix: string = "";
  @ViewChild("phoneInput") phoneInput;
  @Output() emitter = new EventEmitter<string>();
  errorMsg: string = "";
  phoneNumberTemplate = "_+(___)___-____";
  phoneNumber = this.phoneNumberTemplate;
  badIndex = [1,2,6,10];
  constructor() { }

  ngOnInit() {
  }

  getIdentifer(str){
    if(this.prefix.length>0){
      str = this.prefix + "-" + str;
    }
    return str;
  }
  process(event){
    var start = this.phoneInput.nativeElement.selectionStart;
    var end = this.phoneInput.nativeElement.selectionEnd;
    //console.log(event,start,end);
    if(!isNaN(event.key)){
      var updatedPhoneNumber = this.phoneNumber;
      var positionIncrement = this.getPositionIncrement(start);
      var replacePos = start;
      if(this.badIndex.indexOf(start)>=0){
        replacePos = positionIncrement;
        positionIncrement = this.getPositionIncrement(positionIncrement);
      }
      if(start!=end){
        for(var idx=start; idx < end; idx++){
          if(this.badIndex.indexOf(idx)==-1){
            updatedPhoneNumber = this.replaceAt(idx,"_",updatedPhoneNumber);
          }
        }
      }
      updatedPhoneNumber = this.replaceAt(replacePos,event.key,updatedPhoneNumber);
      this.phoneInput.nativeElement.value = updatedPhoneNumber.substr(0,15);
      this.phoneNumber = updatedPhoneNumber.substr(0,15);
      this.phoneInput.nativeElement.setSelectionRange(positionIncrement,positionIncrement);
    } else if(event.key=="Backspace") {
      event.preventDefault();
      var positionDecrement = this.getPositionDecrement(start);
      this.phoneNumber = this.replaceAt(positionDecrement,"_",this.phoneNumber).substr(0,16);
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(positionDecrement,positionDecrement);
    } else if(event.key=="ArrowRight" || event.key=="ArrowLeft"){
      this.phoneInput.nativeElement.setSelectionRange(start,end);
    } else {
      //don't change
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(start,start);
    }
    /*
    var updateModel = this.phoneNumber.replace(/\(/g,'');
    updateModel = updateModel.replace(/\)/g,'-');
    updateModel = updateModel.replace(/\+/g,'-');
    updateModel = updateModel.replace(/_/g,'');
    updateModel = updateModel.replace(/^\D+/g,'');
    this.model = updateModel;
    */
    var updateModel = this.phoneNumber;
    this.model = updateModel;
    this.emitter.emit(this.model);
  }

  getPositionIncrement(pos){
    switch(pos){
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

  getPositionDecrement(pos){
    switch(pos){
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

  check(){
    var error = false;
    var digitCount = this.model.replace(/[^0-9]/g,"").length;
    if(digitCount < 11){

      if((digitCount == 10 && this.model.match(/^\d/g)) || digitCount < 10){
        error = true;
        this.errorMsg = "Invalid phone number";
      }
    }
    if(!error){
      this.errorMsg = "";
    }
  }
  replaceAt (index, character, str) {
    return str.substr(0, index) + character + str.substr(index+character.length);
  }

}
