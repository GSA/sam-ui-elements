import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamTabsNextComponent, SamTabNextComponent } from './tabs.component';
import { SamIconsModule } from '../icon';

@NgModule({
    imports: [CommonModule, SamIconsModule],
    declarations: [ SamTabsNextComponent,SamTabNextComponent ],
    exports: [ SamTabsNextComponent,SamTabNextComponent ],
})
export class SamTabsNextModule { }
