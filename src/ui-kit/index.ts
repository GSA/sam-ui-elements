
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamComponentsModule } from './components';
import { SamDirectivesModule } from './directives';
import { SamElementsModule } from './elements';
import { SamFormControlsModule } from './form-controls';
import { SamFormTemplatesModule } from './form-templates';
import { SamPipesModule } from './pipes';


@NgModule({
  imports: [
    CommonModule,
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule
  ],
  exports: [
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule
  ]
})
export class SamUIKitModule { }



