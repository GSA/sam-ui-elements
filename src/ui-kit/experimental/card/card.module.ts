import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamCardComponent } from './card.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ SamCardComponent ],
  exports: [ SamCardComponent ]
})
export class SamCardModule { }
