import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamSpinnerComponent } from './spinner.component';

@NgModule({
    declarations: [ SamSpinnerComponent ],
    exports: [ SamSpinnerComponent ],
    imports: [CommonModule]
})
export class SamSpinnerModule { }

export { SamSpinnerComponent } from './spinner.component';
