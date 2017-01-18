import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamAccordionSection, SamAccordionComponent } from './accordion.component.ts';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ SamAccordionSection, SamAccordionComponent ],
  exports: [ SamAccordionComponent, SamAccordionSection ]
})
export class AccordionsModule { }