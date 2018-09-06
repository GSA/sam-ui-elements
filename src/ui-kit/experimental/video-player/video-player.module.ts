import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamVideoPlayerComponent } from './video-player.component';

@NgModule({
    declarations: [ SamVideoPlayerComponent ],
    exports: [ SamVideoPlayerComponent ],
    imports: [CommonModule]
})
export class SamVideoPlayerModule { }