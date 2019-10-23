import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamFocusDirective } from './focus.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamFocusDirective ],
    exports: [ SamFocusDirective ],
})
export class SamFocusModule { }

export { SamFocusDirective } from './focus.directive';
