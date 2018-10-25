import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamAlertFooterComponent } from './alert-footer.component';
import { SamAlertModule } from '../alert';

@NgModule({
    imports: [ CommonModule, SamAlertModule ],
    declarations: [ SamAlertFooterComponent ],
    exports: [ SamAlertFooterComponent ],
})
export class SamAlertFooterModule { }
