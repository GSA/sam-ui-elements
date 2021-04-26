import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamPageComponent, SamPageSidebarComponent } from './page.component';
import { FormsModule } from '@angular/forms';
import { SamExperimentalModule } from '../../experimental/experimental.module';



@NgModule({
    imports: [
        CommonModule, FormsModule, SamExperimentalModule

    ],
    declarations: [
        SamPageComponent, SamPageSidebarComponent
    ],
    exports: [
        SamPageComponent, SamPageSidebarComponent
    ],
    // entryComponents: [
    //     SamPageComponent,SamPageSidebarComponent
    // ], 
})
export class SamPageModule { }
export { SamPageComponent, SamPageSidebarComponent } from './page.component';
