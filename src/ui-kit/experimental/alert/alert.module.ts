import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamAlertNextComponent } from './alert.component';
import { SamIconsModule } from '../icon';

@NgModule({
  imports: [ CommonModule, SamIconsModule ],
  declarations: [ SamAlertNextComponent ],
  exports: [ SamAlertNextComponent ]
})
export class SamAlertNextModule { }
