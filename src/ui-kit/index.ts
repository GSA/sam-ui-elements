
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SamComponentsModule } from './components';
import { SamDirectivesModule } from './directives';
import { SamElementsModule } from './elements';
import { SamFormControlsModule } from './form-controls';
import { SamFormTemplatesModule } from './form-templates';
import { SamPipesModule } from './pipes';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule
  ],
  declarations: [],
  exports: [
    SamComponentsModule,
    SamDirectivesModule,
    SamElementsModule,
    SamFormControlsModule,
    SamFormTemplatesModule,
    SamPipesModule
  ],
  providers: []
})
export class SamUiKitModule { }
