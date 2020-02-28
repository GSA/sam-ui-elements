import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamTabsComponent, SamTabComponent } from './tabs.component';

@NgModule({
    declarations: [ SamTabsComponent, SamTabComponent ],
    exports: [ SamTabsComponent, SamTabComponent ],
    imports: [CommonModule]
})
export class SamTabsModule { }

export { SamTabsComponent, SamTabComponent } from './tabs.component';
