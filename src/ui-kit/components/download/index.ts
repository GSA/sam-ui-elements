import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamDownloadComponent } from './download.component';

@NgModule({
    declarations: [ SamDownloadComponent ],
    exports: [ SamDownloadComponent ],
    imports: [CommonModule, RouterModule]
})
export class SamDownloadModule { }

export { SamDownloadComponent } from './download.component';
