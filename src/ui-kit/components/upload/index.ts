import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamUploadComponent } from './upload.component';
import { SamProgressModule } from '../progress-bar';
import { SamDirectivesModule } from '../../directives';
import { SamPipesModule } from '../../pipes';

@NgModule({
    declarations: [ SamUploadComponent ],
    exports: [ SamUploadComponent ],
    imports: [CommonModule, SamDirectivesModule, SamProgressModule, SamPipesModule]
})
export class SamUploadModule { }

export * from './upload.component';
