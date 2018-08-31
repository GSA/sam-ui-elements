import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamButtonNextComponent } from './button.component';

@NgModule({
    declarations: [ SamButtonNextComponent ],
    exports: [ SamButtonNextComponent ],
    imports: [CommonModule]
})
export class SamButtonNextModule { }

export { SamButtonNextComponent } from './button.component';
