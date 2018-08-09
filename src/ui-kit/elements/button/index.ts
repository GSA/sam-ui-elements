import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamButtonComponent } from './button.component';

@NgModule({
    declarations: [ SamButtonComponent ],
    exports: [ SamButtonComponent ],
    imports: [CommonModule]
})
export class SamButtonModule { }

export { SamButtonComponent } from './button.component';
