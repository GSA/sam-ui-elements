import {Component, ChangeDetectorRef, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, forwardRef} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";
import {SamFormService} from '../../form-service';

/**
 * The <sam-date> component is a Date entry portion of a form
 */
@Component({
  selector: 'sam-date',
  templateUrl: 'date.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamDateComponent),
    multi: true
  }]
})
export class SamDateComponent implements OnInit, OnChanges, ControlValueAccessor {
  public INPUT_FORMAT: string = 'Y-M-D';
  public OUTPUT_FORMAT: string = 'YYYY-MM-DD';

  model: any = {
    month: null,
    day: null,
    year: null
  };
  
  /**
  * Sets the general error message for component
  */
  @Input() errorMessage: string = "";
  /**
  * Sets the name attribute for component
  */
  @Input() name: string = "";
  /**
  * Sets the label text
  */
  @Input() label: string = "";
  /**
  * Sets the required text
  */
  @Input() required: string = "";
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string = "";
  /**
  * Sets the disabled status of component, defaults to false
  */
  @Input() disabled: boolean = false;
  /**
  * Deprecated - Sets the current value of the form control
  */
  @Input() value: string;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Deprecated - Event emitted when value changes
  */
  @Output() valueChange = new EventEmitter<any>();
  /**
  * Event emitted when form control loses focus
  */
  @Output() blurEvent = new EventEmitter<any>();
  onChange: any = () => { };
  onTouched: any = () => { };
  @ViewChild('month') month;
  @ViewChild('day') day;
  @ViewChild('year') year;
  @ViewChild('wrapper') wrapper;
  allowChars = ["0","1","2","3","4","5","6","7","8","9","Backspace","ArrowLeft","ArrowRight","Tab","Delete"];

  get inputModel(){
    return {
      day: this.day.nativeElement.value,
      month: this.month.nativeElement.value,
      year: this.year.nativeElement.value
    };
  }

  constructor(private samFormService:SamFormService, private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.name) {
      throw new Error('SamTimeComponent required a name for 508 compliance');
    }
    if(this.control){
      if(!this.useFormService){
        this.control.statusChanges.subscribe(()=>{
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
      }
      else {
        this.samFormService.formEventsUpdated$.subscribe(evt=>{
          if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='submit'){
            this.wrapper.formatErrors(this.control);
          } else if((!evt['root']|| evt['root']==this.control.root) && evt['eventType'] && evt['eventType']=='reset'){
            this.wrapper.clearError();
          }
        });
      }
    }
  }

  ngOnChanges() {
    this.parseValueString();
  }

  parseValueString() {
    if (this.value) {
      // use the forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.value, this.INPUT_FORMAT);
      if (m.isValid()) {
        let monthVal = m.month() + 1;
        let dateVal = m.date();
        this.model.month = monthVal;
        this.model.day = dateVal;
        this.model.year = m.year();
      }
    }
    else{
      this.model.month = "";
      this.model.day = "";
      this.model.year = "";

      this.month.nativeElement.value = "";
      this.day.nativeElement.value = "";
      this.year.nativeElement.value = "";
    }
  }

  onMonthBlur(value){
    if(this._shouldPad(value)){
      this.month.nativeElement.value = "0" + value;
    }
  }

  onDayBlur(value){
    if(this._shouldPad(value)){
      this.day.nativeElement.value = "0" + value;
    }
  }

  _shouldPad(value){
    var leadingZero = value[0] === "0"
    if(parseInt(value, 10) < 10 && !leadingZero){
      return true;
    }
  }

  getDate(override=null) {
    let obj = override ? override : this.model;
    return moment([override.year, override.month-1, override.day]);
  }
  
  onMonthInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum;
    if(!isNaN(this.month.nativeElement.value) && this.month.nativeElement.value!=""){
      possibleNum = (parseInt(this.month.nativeElement.value) * 10) + inputNum;
    } else{
      possibleNum = inputNum;
    }
    if(possibleNum > 12 || this.allowChars.indexOf(event.key)==-1){
      event.preventDefault();
      return;
    }
    if(event.key.match(/[0-9]/)!=null){
      if(event.target.value.length==1 || 
        (event.target.value.length==0 && possibleNum > 3)){
        this.day.nativeElement.focus();
      }
      this.month.nativeElement.value = possibleNum;
      let dupModel = this.inputModel;
      this.onChangeHandler(dupModel);
      event.preventDefault();
    }
    if(event.key.match(/[0-9]/)!=null){
    }
  }

  onDayInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum;
    if(!isNaN(this.day.nativeElement.value) && this.day.nativeElement.value!=""){
      possibleNum = (parseInt(this.day.nativeElement.value) * 10) + inputNum;
    } else{
      possibleNum = inputNum;
    }
    if(possibleNum > 31 || this.allowChars.indexOf(event.key)==-1){
      event.preventDefault();
      return;
    }
    if(event.key.match(/[0-9]/)!=null){ 
      if(event.target.value.length==1 || 
        (event.target.value.length==0 && possibleNum > 3)){
        this.year.nativeElement.focus();
      }
      this.day.nativeElement.value = possibleNum;
      let dupModel = this.inputModel;
      this.onChangeHandler(dupModel);
      event.preventDefault();
    }
  }

  onYearInput(event){
    var inputNum = parseInt(event.key, 10);
    var possibleNum;
    
    if(!isNaN(this.year.nativeElement.value) && this.year.nativeElement.value!=""){
      possibleNum = (parseInt(this.year.nativeElement.value) * 10) + inputNum;
    } else{
      possibleNum = inputNum;
    }
    if(possibleNum > 9999 || this.allowChars.indexOf(event.key)==-1){
      event.preventDefault();
      return
    }
    if(event.key.match(/[0-9]/)!=null){
      if(event.target.value.length+1==4){
        this.blurEvent.emit();
      }
      this.year.nativeElement.value = possibleNum;
      let dupModel = this.inputModel;
      this.onChangeHandler(dupModel);
      event.preventDefault();
    }
  }

  removalKeyHandler(){
    let dupModel = this.inputModel;
    this.onChangeHandler(dupModel);
  }

  onChangeHandler(override=null) {
    this.onTouched();
    if (this.isClean(override)) {
      this.onChange(null);
      this.valueChange.emit(null);
    } else if (!this.getDate(override).isValid()) {
      this.onChange('Invalid Date');
      this.valueChange.emit('Invalid Date');
    } else {
      // use the strict format for outputs
      let dateString = this.getDate(override).format(this.OUTPUT_FORMAT);
      this.onChange(dateString);
      this.valueChange.emit(dateString);
    }
  }

  isClean(override=null) {
    let dupModel = this.inputModel;
    if(override){
      dupModel = override;
    }
    return (isNaN(dupModel.day) || dupModel.day === null || dupModel.day === "" ) &&
      (isNaN(dupModel.month) || dupModel.month === null || dupModel.month === "") &&
      (isNaN(dupModel.year) || dupModel.year === null || dupModel.year === "");
  }

  isValid() {
    let dupModel = this.inputModel;
    return this.getDate(dupModel).isValid();
  }

  monthName() {
    return `${this.name}_month`;
  }

  dayName() {
    return `${this.name}_day`;
  }

  yearName() {
    return `${this.name}_year`;
  }

  triggerTouch(){
    this.onTouched();
  }

  triggerMonthTouch(event){
    if(event.target.value.substring(0,1) === "0"){
      this.month.nativeElement.value = event.target.value.substring(1);
    }
    this.onTouched();
  }
  triggerDayTouch(event){
    if(event.target.value.substring(0,1) === "0"){
      this.day.nativeElement.value = event.target.value.substring(1);
    }
    this.onTouched();
  }

  resetInput(){
    this.day.nativeElement.value = "";
    this.month.nativeElement.value = "";
    this.year.nativeElement.value = "";
  }

  //controlvalueaccessor methods
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    if(value){
      this.value = value;
      this.parseValueString();
    } else {
      this.resetInput();
      this.value = "";
      this.parseValueString();
    }
  }
}
