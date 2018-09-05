import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesizePipe } from './filesize.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [ FilesizePipe ],
    exports: [ FilesizePipe ],
})
export class SamFilesizeModule { }

export * from './filesize.pipe';