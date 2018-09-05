import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamDragDropDirective } from './drag-drop.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamDragDropDirective ],
    exports: [ SamDragDropDirective ],
})
export class SamDragDropModule { }

export * from './drag-drop.directive';
