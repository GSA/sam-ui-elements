import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamUploadComponent } from './upload.component';
import { SamProgressModule } from '../../components/progress-bar';
import { SamDragDropModule } from '../../directives';
import { SamFilesizeModule } from '../../pipes';

@NgModule({
    declarations: [ SamUploadComponent ],
    exports: [ SamUploadComponent ],
    imports: [CommonModule, SamDragDropModule, SamProgressModule, SamFilesizeModule]
})
export class SamUploadModule { }