import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamHistoryComponent } from './history.component';

@NgModule({
    declarations: [ SamHistoryComponent ],
    exports: [ SamHistoryComponent ],
    imports: [CommonModule, RouterModule]
})
export class SamHistoryModule { }

export { SamHistoryComponent } from './history.component';
