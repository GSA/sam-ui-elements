import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamClickOutsideDirective } from './click-outside.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamClickOutsideDirective ],
    exports: [ SamClickOutsideDirective ],
})
export class SamClickOutsideModule { }

export * from './click-outside.directive';
