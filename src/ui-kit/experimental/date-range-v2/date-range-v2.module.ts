import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamDateRangeV2Component } from './date-range-v2.component';

//import {A11yModule} from '@angular/cdk';
import {OverlayModule} from '../../experimental/patterns/layout/components/core/overlay';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    imports: [CommonModule,
      // MatButtonModule,
       MatDialogModule,
       OverlayModule,
      // A11yModule,
    ],
    declarations: [SamDateRangeV2Component],
    exports: [SamDateRangeV2Component]
})
export class SamDateRangeV2Module { }
