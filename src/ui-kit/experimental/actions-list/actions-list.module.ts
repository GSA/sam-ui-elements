import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SamActionsListComponent } from './actions-list.component';
import { SamComponentsModule } from '../../components';

@NgModule({
  imports: [
    CommonModule,
    SamComponentsModule,
  ],
  declarations: [
    SamActionsListComponent
  ],
  exports: [
    SamActionsListComponent
  ]
})
export class SamActionsListModule {}