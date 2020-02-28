import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamModalComponent } from './modal.component';
import { SamButtonModule } from '../../elements/button';
import { SamIconsModule} from '../../experimental/icon';
import { SamClickOutsideModule } from '../../directives/click-outside';

@NgModule({
    imports: [CommonModule, SamButtonModule, SamIconsModule, SamClickOutsideModule],
    declarations: [ SamModalComponent ],
    exports: [ SamModalComponent ],
})
export class SamModalModule { }

export { SamModalComponent } from './modal.component';
