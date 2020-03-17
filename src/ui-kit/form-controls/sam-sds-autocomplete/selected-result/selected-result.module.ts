import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SAMSDSSelectedResultComponent } from './selected-result.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [SAMSDSSelectedResultComponent],
  exports: [SAMSDSSelectedResultComponent]
})
export class SAMSdsSelectedResultsModule {}
