
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamComponentsModule } from './components';
import { SamDirectivesModule } from './directives';
import { SamElementsModule } from './elements';
import { SamFormControlsModule } from './form-controls';
import { SamFormTemplatesModule } from './form-templates';
import { SamPipesModule } from './pipes';
import { ServiceDirectivesModule } from './service-directives';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule,
    ServiceDirectivesModule
  ],
  exports: [
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule,
    ServiceDirectivesModule
  ]
})
export class SamUIKitModule { }



