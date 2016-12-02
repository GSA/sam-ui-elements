// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Sam Angular Exports
import { SamSelectComponent } from './sam-select';


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [ SamSelectComponent ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  exports: [ SamSelectComponent ],
  providers: [ ]
})
export class SamAngularModule { }
