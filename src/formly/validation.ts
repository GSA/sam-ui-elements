import { FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function minDateValidationMessage(err, field) {
    let dt = field.templateOptions.minDate;
    let dateFormat = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
    return `Date must be after ${dateFormat}`;
}

export function maxDateValidationMessage(err, field) {
    let dt = field.templateOptions.maxDate;
    let dateFormat = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
    return `Date must be before ${dateFormat}`;
}


export function betweenDateValidationMessage(err, field) {
    let dtnmax = field.templateOptions.maxDate;
    let dateMaxFormat = (dtnmax.getMonth() + 1) + "/" + dtnmax.getDate() + "/" + dtnmax.getFullYear();
    let dtmin = field.templateOptions.minDate;
    let dateMinFormat = (dtmin.getMonth() + 1) + "/" + dtmin.getDate() + "/" + dtmin.getFullYear();
    return `Date must be between ${dateMinFormat} and ${dateMaxFormat} `;
}

export function invalidDateFormatValidationMessage(err, field) {
    return `Valid date format required (ex: MM/DD/YYYY)`;
}


/**
 * 
 * @param control 
 * @param field 
 */
export function minDateValidator(control: FormControl, field): ValidationErrors {
    let toReturn = null;
    let minDateField = field.templateOptions.minDate;
    let value = control.value;
    if (value && minDateField) {
        if (value instanceof Date && minDateField instanceof Date) {
            if (value < minDateField) {
                if (!field.templateOptions.maxDate && !(field.templateOptions.maxDate instanceof Date)) {
                    toReturn = {
                        'minDate': true
                    };
                } else {
                    toReturn = {
                        'betweenDate': true
                    };
                }
            }
        }
    }

    return toReturn;
}


/**
 * 
 * @param control 
 * @param field 
 */
export function maxDateValidator(control: FormControl, field): ValidationErrors {
    let toReturn = null;
    let maxDateField = field.templateOptions.maxDate;
    let value = control.value;
    if (value && maxDateField) {
        if (value instanceof Date && maxDateField instanceof Date) {
            if (value > maxDateField) {
                if (!field.templateOptions.minDate && !(field.templateOptions.minDate instanceof Date)) {
                    toReturn = {
                        'maxDate': true
                    };
                } else {
                    toReturn = {
                        'betweenDate': true
                    };
                }
            }
        }
    }
    return toReturn;
}

export function minDateToDateRangePicker(model: any, formState: any, field) {
    let date = null;
    //Setting a minumn date for the date range picker
    if (field.parent.templateOptions.minDate) {
      date = new Date(field.parent.templateOptions.minDate.getTime());
    }
    if (model) {
      if (model.fromDate) {
        date = model.fromDate;
      }
    }
  
    return date;
  }
  
  export function minDateFromDateRangePicker(model: any, formState: any, field) {
    let date = null;
    //Setting a minumn date for the date range picker
    if (field.parent.templateOptions.minDate) {
      date = new Date(field.parent.templateOptions.minDate.getTime());
    }
    return date;
  }
  
  export function maxDateToDateRangePicker(model: any, formState: any, field) {
    let date = null;
    //Setting a max date for the date range picker 
    if (field.parent.templateOptions.maxDate) {
      date = new Date(field.parent.templateOptions.maxDate.getTime());
    }
    return date;
  }
  
  export function maxDateFromDateRangePicker(model: any, formState: any, field) {
    let date = null;
    //Setting a max date for the date range picker
    if (field.parent.templateOptions.maxDate) {
      date = new Date(field.parent.templateOptions.maxDate);
    }
    if (model) {
      if (model.toDate) {
        date = model.toDate;
      }
    }
    return date;
  }