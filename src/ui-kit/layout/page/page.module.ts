import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPageComponent } from './page.component';
import { FormsModule } from '@angular/forms';
import {SamExperimentalModule} from '../../experimental/experimental.module';



@NgModule({
    imports: [
        CommonModule, FormsModule,SamExperimentalModule

    ],
    declarations: [
        SamPageComponent
    ],
    exports: [
        SamPageComponent
    ],
    entryComponents: [
        SamPageComponent
    ]
})
export class SamPageModule { }
export { SamPageComponent } from './page.component';
