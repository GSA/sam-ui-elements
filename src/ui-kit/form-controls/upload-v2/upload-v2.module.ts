import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamUploadComponentV2 } from './upload-v2.component';
import { SamProgressModule } from '../../components/progress-bar';
import { SamDragDropModule } from '../../directives';
import { SamFilesizeModule } from '../../pipes';
import {SamModalModule} from '../../components/modal';
import { SamToggleSwitchModule } from '../toggle-switch';

@NgModule({
    declarations: [ SamUploadComponentV2 ],
    exports: [ SamUploadComponentV2 ],
    imports: [
        CommonModule,
        FormsModule,
        SamDragDropModule,
        SamProgressModule,
        SamFilesizeModule,
        SamModalModule,
        SamToggleSwitchModule,
    ]
})
export class SamUploadV2Module { }