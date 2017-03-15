import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamAutocompleteModule } from '../autocomplete';
import { SamListComponent } from './list.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [ FormsModule, CommonModule,SamWrapperModule,SamAutocompleteModule ],
  declarations: [ SamListComponent ],
  exports: [ SamListComponent ]
})
export class SamListModule {}


export * from './list.component';
