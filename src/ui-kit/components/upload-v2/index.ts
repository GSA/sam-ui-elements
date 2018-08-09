import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamUploadComponentV2 } from './upload-v2.component';
import { SamProgressModule } from '../progress-bar';
import { SamDirectivesModule } from '../../directives';
import { SamPipesModule } from '../../pipes';

@NgModule({
    declarations: [ SamUploadComponentV2 ],
    exports: [ SamUploadComponentV2 ],
    imports: [
        CommonModule,
        FormsModule,
        SamDirectivesModule,
        SamProgressModule,
        SamPipesModule
    ]
})
export class SamUploadV2Module { }

export * from './upload-v2.component';