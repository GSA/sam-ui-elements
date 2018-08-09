import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamActionButton } from './action-button.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamActionButton ],
    exports: [ SamActionButton ],
})
export class SamActionButtonModule { }

export { SamActionButton } from './action-button.component';