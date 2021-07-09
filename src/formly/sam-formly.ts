import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  template: ''
})
export abstract class AbstractSamFormly extends FieldType implements OnInit {

  public cdr: ChangeDetectorRef;
  public template: any;

  public ngOnInit() {
    this.setProperties(
      this.template,
      (<any>this).field.templateOptions
    );
  }

  public setProperties(component: any, configuration: any) {
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
