import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetWrapper } from './fieldset-wrapper.component';

@NgModule({
    declarations: [ FieldsetWrapper ],
    exports: [ FieldsetWrapper ],
    imports: [CommonModule]
})
export class SamFieldsetWrapperModule { }

export { FieldsetWrapper } from './fieldset-wrapper.component';
