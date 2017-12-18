import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SamAccordionSection,
  SamAccordionComponent
} from './accordion.component';

@NgModule({
  declarations: [ SamAccordionSection, SamAccordionComponent ],
  exports: [ SamAccordionComponent, SamAccordionSection ],
  imports: [ CommonModule ],
})
export class AccordionsModule { }

export * from './accordion.component';
