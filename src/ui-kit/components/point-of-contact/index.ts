import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPointOfContactComponent } from './point-of-contact.component';

@NgModule({
    declarations: [ SamPointOfContactComponent ],
    exports: [ SamPointOfContactComponent ],
    imports: [CommonModule]
})
export class SamPointOfContactModule { }

export { SamPointOfContactComponent } from './point-of-contact.component';
