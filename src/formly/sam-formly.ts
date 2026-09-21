import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { FormControl } from "@angular/forms";

export interface SamFormlyTemplateComponent {
  control?: FormControl;
}

@Component({
  template: "",
  standalone: false,
})
export abstract class AbstractSamFormly<
  T extends SamFormlyTemplateComponent = SamFormlyTemplateComponent,
>
  extends FieldType
  implements OnInit
{
  public cdr: ChangeDetectorRef;
  public template: T;

  public ngOnInit() {
    this.setProperties(
      this.template,
      this.field.templateOptions as Record<string, unknown>
    );
  }

  public setProperties(
    component: T,
    configuration: Record<string, unknown>
  ): void {
    Object.keys(configuration).forEach((key) => {
      (component as unknown as Record<string, unknown>)[key] =
        configuration[key];
    });
    if (this.template.control) {
      this.template.control = this.formControl as FormControl;
    }
    this.cdr.detectChanges();
  }
}
