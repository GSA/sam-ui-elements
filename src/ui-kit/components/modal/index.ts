import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamModalComponent } from './modal.component';
import { SamButtonModule } from '../../elements/button';
import { SamIconsModule} from '../../experimental/icon';

@NgModule({
    imports: [CommonModule, SamButtonModule, SamIconsModule],
    declarations: [ SamModalComponent ],
    exports: [ SamModalComponent ],
})
export class SamModalModule { }

export { SamModalComponent } from './modal.component';
