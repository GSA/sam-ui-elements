import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamModalComponent } from './modal.component';
import { SamButtonModule } from '../../elements';
import { SamIconsModule } from '../../experimental';

@NgModule({
    imports: [CommonModule, SamButtonModule, SamIconsModule],
    declarations: [ SamModalComponent ],
    exports: [ SamModalComponent ],
})
export class SamModalModule { }

export { SamModalComponent } from './modal.component';
