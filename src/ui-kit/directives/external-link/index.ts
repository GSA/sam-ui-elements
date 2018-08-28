import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamExternalLinkDirective } from './external-link.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ SamExternalLinkDirective ],
    exports: [ SamExternalLinkDirective ],
})
export class SamExternalLinkModule { }

export * from './external-link.directive';
