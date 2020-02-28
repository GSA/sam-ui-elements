import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamTabOutsideDirective } from './taboutside.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamTabOutsideDirective ],
    exports: [ SamTabOutsideDirective ],
})
export class SamTabOutsideModule { }

export { SamTabOutsideDirective } from './taboutside.directive';
