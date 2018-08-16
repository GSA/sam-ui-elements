import { ChangeDetectorRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SamAutocompleteComponent } from '../ui-kit';

export abstract class AbstractSamFormly extends FieldType {

  public cdr: ChangeDetectorRef;
  public template: any;

  public ngDoCheck () {
    this.setProperties(
      this.template,
      (<any>this).field.templateOptions
    );
  }

  public setProperties (component: any, configuration: any) {
    Object.keys(configuration).forEach(
      key => {
        component[key] = configuration[key];
      }
    );
    if ((<any>this).template.control) {
      (<any>this).template.control = (<any>this).formControl;
    }
    this.cdr.detectChanges();
  }
}
