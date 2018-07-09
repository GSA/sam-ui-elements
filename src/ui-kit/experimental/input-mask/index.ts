import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SamInputMaskComponent } from './input-mask.component';

@NgModule({
    imports: [ FormsModule ],
    declarations: [ SamInputMaskComponent ],
    exports: [ SamInputMaskComponent ]
})
export class SamInputMaskModule { }
  
export * from './input-mask.component';