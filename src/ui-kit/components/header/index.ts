import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamHeaderComponent } from './header.component';

@NgModule({
    declarations: [ SamHeaderComponent ],
    exports: [ SamHeaderComponent ],
    imports: [CommonModule]
})
export class SamHeaderModule { }

export { SamHeaderComponent } from './header.component';
